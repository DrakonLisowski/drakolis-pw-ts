import { join } from 'path';
import process from 'process';
import * as fs from 'fs';
import { Server, Client, ClientSocket, ServerSocket, NodeMessage } from 'veza';
import { Service } from '../ServiceDecorator';
import ContextService from '../context';
import LoggerService from '../logger';

const BASE_PATH = 'ipc';

export enum AllowedSocket {
  HTTPApi = 'http-api',
  IGBot = 'bot-ig'
};

export class SocketIdentifier {

  constructor(
    public name: AllowedSocket,
    public id?: number,
  ) {}

  public buildName(): string {
    if (this.id) {
      return `${this.name}-${this.id}`;
    } else {
      return `${this.name}`;
    }
  }
}

type EventListener = (message: NodeMessage | Uint8Array, client: ServerSocket) => void;
// type ListenerClient = (message: NodeMessage | Uint8Array, client: ClientSocket) => void;

@Service()
export default class IPCService {

  private identifier: SocketIdentifier;
  private server: Server;
  private clients: ClientSocket[] = [];

  constructor(private context: ContextService, private serviceLogger: LoggerService) {
    this.context.addSubContext(this, null, 'IPC');
    this.serviceLogger = this.serviceLogger.addLabels(this.context.getContext(this));
  }

  private chooseSocketPath(sockets: string[]): string {
    return sockets[Math.round(Math.random()*sockets.length)];
  }

  private findSocketPath(identifier: SocketIdentifier): string {
    let path = `${BASE_PATH}`;

    if (identifier.id) {
      path = join(path, identifier.buildName());
    } else {
      const paths = fs.readdirSync(BASE_PATH)
        .map(file => join(BASE_PATH, file))
        .filter(file => file.startsWith(join(BASE_PATH, identifier.buildName())));
      if (!paths || !paths.length) {
        throw new Error(`No sockets for '${identifier.name}' found`);
      }
      path = this.chooseSocketPath(paths);
    }

    if (!fs.existsSync(path)) {
      throw new Error(`File at '${path}' does not exist`);
    }

    return path;
  }

  private makeClientName(identifier: SocketIdentifier): string {
    return `${this.identifier.buildName()}->${identifier.buildName()}`
  }

  public setIdentifier(identifier: SocketIdentifier) {
    if (!this.identifier) {
      this.identifier = identifier;
    } else {
      this.serviceLogger.warn('WTF, somebody is replacing my identifier!');
    }
  }

  public async startServer(identifier: SocketIdentifier, force: boolean = true) {
    this.serviceLogger.info('Starting IPC server...');

    if (!identifier.id) {
      this.serviceLogger.warn('No id was set! This process can\'t fork\\cluster!');
    }

    this.setIdentifier(identifier);
    const name = this.identifier.buildName();

    const filePath = join(BASE_PATH, name);

    if (fs.existsSync(filePath)) {
      this.serviceLogger.warn('OMG, file already exists');
      if (force) {
        this.serviceLogger.warn('Deleting...');
        fs.unlinkSync(filePath);
      } else {
        throw new Error('File already exists');
      }
    }

    this.server = new Server(name)
      .on('connect', client => this.serviceLogger.info(`Client Connected: ${client.name}`))
      .on('disconnect', client => this.serviceLogger.info(`Client Disconnected: ${client.name}`))
      .on('error', (error, client) =>
        this.serviceLogger.exception(`Error from ${client.name}`, error),
      );
    this.server.listen(filePath);

    this.serviceLogger.info('IPC server started!');
    return this.server;
  }

  public async connectTo(identifier: SocketIdentifier, autoReconect: boolean = false) {
    const targetPath = this.findSocketPath(identifier);
    const cl: ClientSocket = await new Promise((res, rej) => {
      const cli = new Client(this.makeClientName(identifier))
        .on('error', (error, client) =>
          this.serviceLogger.exception(`Error from ${client.name}:`, error),
        )
        .on('disconnect', client => {
          this.serviceLogger.info(`Client disconnected from ${client.name}`);
          if (autoReconect) {
            cli.connectTo(targetPath);
          }
        })
        .on('ready', client => {
          this.serviceLogger.info(`Connected to: ${client.name}`);
          res(client);
        });
      cli.connectTo(targetPath);
    });

    this.clients.push(cl);
  }

  public onMessage(listener: EventListener) {
    this.server.on('message', listener);
  }

  public async sendMessage(identifier: SocketIdentifier, message: any) {
    const client = this.clients.find(cl => cl.client.name === this.makeClientName(identifier));
    if (!client) {
      throw new Error(`Socket for ${identifier.buildName()} was not connected`);
    }
    client.send(message);
  }

}
