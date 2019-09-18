import jayson from 'jayson';
import config from '../../config';
import { BaseApplication } from '../BaseApplication';
import { Service } from '../../services/eService';
// tslint:disable-next-line: import-name
import LoggerService from '../../services/logger';
import commandLoader from './commandLoader';

export default class HttpAPIApplication extends BaseApplication {

  private appLogger: LoggerService;
  private server: jayson.Server;

  public getName(): string {
    return 'InfoAPI';
  }

  public getRequiredServices(): Service[] {
    return [Service.Logger, Service.TelegramBot, Service.Postgress];
  }

  public async startApplication(): Promise<boolean> {
    const registry = this.getRegistry();
    this.appLogger = registry[Service.Logger];
    this.appLogger.info('Starting application...');
    this.server = new jayson.Server(commandLoader());

    return new Promise((res) => {
      this.server.http().listen(
        config.apiHost.port,
        config.apiHost.host,
        () => {
          this.appLogger
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
    this.appLogger.info('Stopping application...');
    return new Promise((res, rej) => {
      this.server.http().close();
      this.appLogger.info('Application stopped!');
      res(true);
    });
  }

}
