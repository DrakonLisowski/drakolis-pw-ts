import jayson from 'jayson';
import config from '../../config';
import { BaseApplication } from '../BaseApplication';
import commandLoader from './commandLoader';
import { ServiceInjector } from '../../services/ServiceInjector';
import LoggerService from '../../services/logger';

export default class HttpAPIApplication extends BaseApplication {

  private applicationLogger: LoggerService;
  private server: jayson.Server;

  constructor() {
    super();
    this.applicationLogger = ServiceInjector.resolve<LoggerService>(LoggerService)
      .addLabel(this.getLoggingLabel());
  }

  public getName(): string {
    return 'InfoAPI';
  }

  public async startApplication(): Promise<boolean> {
    this.applicationLogger = ServiceInjector.resolve<LoggerService>(LoggerService);
    this.server = new jayson.Server(commandLoader());

    return new Promise((res) => {
      this.server.http().listen(
        config.apiHost.port,
        config.apiHost.host,
        () => {
          this.applicationLogger
            .info(`Application started @ ${config.apiHost.host}:${config.apiHost.port}!`);
          res(true);
        },
      );
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
