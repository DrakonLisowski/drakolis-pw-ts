import path from 'path';
import { Server, Client, ClientSocket } from 'veza';
import LoaderService from '../LoaderService';
import ContextService from '../context';
import LoggerService from '../logger';

const BASE_PATH = '/tmp/var/';

export default class IPCService extends LoaderService<Server> {

  private server: Server;
  private clients: ClientSocket[];

  constructor(
    private context: ContextService,
    private serviceLogger: LoggerService,
  ) {
    super();
    this.context.addSubContext(this, null, 'IPC');
    this.serviceLogger = this.serviceLogger.addLabels(this.context.getContext(this));
  }

  public async connectTo(name: string) {
    const cl: ClientSocket = await new Promise((res, rej) => {
      new Client(name)
        .on('error', (error, client) =>
          this.serviceLogger.exception(`Error from ${client.name}:`, error),
        )
        .on('disconnect', client => this.serviceLogger.info(`Disconnected from ${client.name}`))
        .on('ready', (client) => {
          this.serviceLogger.info(`Connected to: ${client.name}`);
          res(client);
        });
    });

    cl.client.connectTo(path.join(BASE_PATH, name));

    this.clients.push(cl);
  }

  public async sendMessage(name: string, message: any) {
    const client = this.clients.find(cl => cl.name === name);
    if (!client) {
      throw new Error(`Socket ${name} was not connected`);
    }
    client.send(message);
  }

  // HACK:: This wraps parameter to be named
  public async init(name: string = '') {
    return super.init(name);
  }

  protected initInstance(name: string = ''): Promise<Server> {
    if (!name) {
      throw new Error(`Server needs a name`);
    }

    this.server = new Server(name)
      .on('connect', client => this.serviceLogger.info(`Client Connected: ${client.name}`))
      .on('disconnect', client => this.serviceLogger.info(`Client Disconnected: ${client.name}`))
      .on('error', (error, client) =>
        this.serviceLogger.exception(`Error from ${client.name}`, error),
      );

    return this.server.listen(path.join(BASE_PATH, name));
  }
}
