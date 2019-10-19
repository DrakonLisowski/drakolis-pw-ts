import path from 'path';
import process from 'process';
import * as fs from 'fs';
import { Server, Client, ClientSocket, ServerSocket, NodeMessage } from 'veza';
import { Service } from '../ServiceDecorator';
import ContextService from '../context';
import LoggerService from '../logger';

const BASE_PATH = 'ipcLogs';
interface ServerPid {
  name: string;
  server: Server;
}
type LicenerServer = (message: NodeMessage|Uint8Array, client: ServerSocket)  => void;
type LicenerClient = (message: NodeMessage|Uint8Array, client: ClientSocket)  => void;

@Service()
export default class IPCService {
  private server: Server;
  private serversPID: ServerPid[] = [];
  private clients: ClientSocket[] = [];
  private licenersServer: LicenerServer[] = [];

  constructor(
    private context: ContextService,
    private serviceLogger: LoggerService,
  ) {
    this.context.addSubContext(this, null, 'IPC');
    this.serviceLogger = this.serviceLogger.addLabels(this.context.getContext(this));
  }
  public async getConnect(name: string) {
    this.serviceLogger.info(`Process pid: ${JSON.stringify(process.pid)}`);
    const cl: ClientSocket = await new Promise((res, rej) => {
      const cli = new Client(name)
        .on('error', (error, client) =>
          this.serviceLogger.exception(`Error from ${client.name}:`, error),
        )
        .on('disconnect', (client) => {
          this.serviceLogger.info(`Client disconnected from ${client.name}`);
        })
        .on('ready', (client) => {
          this.serviceLogger.info(`Connected to: ${client.name}`);
          res(client);
        });
      cli.connectTo(path.join(BASE_PATH, name));
    });
    cl.send({ pid: process.pid });
    cl.socket.removeAllListeners();
    cl.disconnect();
  }
  public async connectTo(name: string, autoReconect = false) {
    this.serviceLogger.info(`Process pid: ${JSON.stringify(process.pid)}`);
    const cl: ClientSocket = await new Promise((res, rej) => {
      const cli = new Client(name)
        .on('error', (error, client) =>
          this.serviceLogger.exception(`Error from ${client.name}:`, error),
        )
        .on('disconnect', (client) => {
          this.serviceLogger.info(`Client disconnected from ${client.name}`);
          if (autoReconect) {
            cli.connectTo(path.join(BASE_PATH, name));
          }
        })
        .on('ready', (client) => {
          this.serviceLogger.info(`Connected to: ${client.name}`);
          res(client);
        });
      cli.connectTo(path.join(BASE_PATH, name));
    });
    cl.send({ pid: process.pid });
    this.clients.push(cl);
  }

  public async sendMessage(message: any, name: string = '') {
    if (!name) {
      await this.serversPID.map(async (server) => {
        await server.server.broadcast(message);
      });
    } else {
      const server = this.serversPID.find(srv => srv.name === name);
      await server.server.broadcast(message);
    }
  }
  public async sendMessageClient(name: string, message: any) {
    const client = this.clients.find(cl => cl.name === name);
    if (!client) {
      throw new Error(`Socket ${name} was not connected`);
    }
    client.send(message);
  }
  public onMessage(listener: LicenerServer) {
    this.licenersServer.push(listener);
  }
  public async onMessageClient(
    name: string,
    listener: (message: NodeMessage, client: ClientSocket) => void,
  ) {
    const client = this.clients.find(cl => cl.name === name);
    if (!client) {
      throw new Error(`Socket ${name} was not connected`);
    }
    client.client.on('message', listener);
  }

  public async startServer(name: string = '') {
    this.serviceLogger.info('Starting service...');
    if (!name) {
      throw new Error(`Server needs a name`);
    }
    const nameA = `${name.toLowerCase()}`;
    const filePath = path.join(BASE_PATH, nameA);
    try {
      await fs.unlinkSync(filePath);
    } catch (err) {
      if (err) {
        this.serviceLogger.error(err);
      }
    }
    this.server = new Server(nameA)
      .on('connect', client => this.serviceLogger.info(`Client Connected: ${client.name}`))
      .on('disconnect', client => this.serviceLogger.info(`Client Disconnected: ${client.name}`))
      .on('error', (error, client) =>
        this.serviceLogger.exception(`Error from ${client.name}`, error),
      );
    this.server.setMaxListeners(Infinity);
    this.server.listen(filePath);
    this.server.on('message', (message) => {
      if (message.data.pid) {
        const nameServer = `${name}-${message.data.pid}`;
        this.serviceLogger.info(`Make pid-server: ${nameServer}`);
        this.startPidServer(nameServer);
      }
    });
    this.serviceLogger.info('Service started!');
    return this.server;
  }
  public async startPidServer(name: string = '') {
    this.serviceLogger.info('Starting PID server ...');
    if (!name) {
      throw new Error(`Server needs a name`);
    }
    const nameA = `${name.toLowerCase()}`;
    const filePath = path.join(BASE_PATH, nameA);
    try {
      await fs.unlinkSync(filePath);
    } catch (err) {
      this.serviceLogger.info(`ICP file not found`);
    }
    const server = new Server(nameA)
    .on('connect', client => this.serviceLogger.info(`Client Connected: ${client.name}`))
    .on('disconnect', client => this.serviceLogger.info(`Client Disconnected: ${client.name}`))
    .on('error', (error, client) =>
      this.serviceLogger.exception(`Error from ${client.name}`, error),
    );
    this.licenersServer.map((licener) => {
      server.on('message', licener);
    });
    this.serversPID.push({ name, server });
    server.listen(filePath);
    this.serviceLogger.info('Service started!');
    return server;
  }
}
