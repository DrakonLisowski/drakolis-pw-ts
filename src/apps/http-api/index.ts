import jayson from 'jayson';
import config from '../../config';
import { BaseApplication } from '../BaseApplication';
import commandLoader from './commandLoader';
import { ServiceInjector } from '../../services/ServiceInjector';
import LoggerService from '../../services/logger';
import ContextService from '../../services/context';
import IpcService from '../../services/ipc';

export default class HttpAPIApplication extends BaseApplication {
  private applicationLogger: LoggerService;

  private server: jayson.Server;

  private ipcService: IpcService;

  constructor() {
    super();
    const context = ServiceInjector.resolve<ContextService>(ContextService).addRootContext(
      this.getLoggingLabel()
    );
    this.applicationLogger = ServiceInjector.resolve<LoggerService>(LoggerService).addLabels(
      context.getRootContext()
    );
  }

  public getName(): string {
    return 'InfoAPI';
  }

  public async startApplication(): Promise<boolean> {
    const nameIPC = 'igbot';
    const namePID = `${nameIPC}-${process.pid}`;
    this.server = new jayson.Server(commandLoader());
    await this.ipcService.getConnect(nameIPC);
    await setTimeout(async () => {
      await this.ipcService.connectTo(namePID);
      await this.ipcService.onMessageClient(namePID, (message, client) => {
        this.applicationLogger.info(`Message: ${JSON.stringify(message)}`);
      });
    }, 5000);
    setInterval(() => {
      this.ipcService.sendMessageClient(namePID, `from client tessdadasdasczczx`);
    }, 1000);

    return new Promise(res => {
      this.server.http().listen(config.apiHost.port, config.apiHost.host, () => {
        this.applicationLogger.info(
          `Application started @ ${config.apiHost.host}:${config.apiHost.port}!`
        );
        res(true);
      });
    });
  }

  public isRunning(): boolean {
    return this.server.http().listening;
  }

  public async stop(): Promise<boolean> {
    this.applicationLogger.info('Stopping application...');
    return new Promise((res, rej) => {
      this.server.http().close();
      this.applicationLogger.info('Application stopped!');
      res(true);
    });
  }
}
