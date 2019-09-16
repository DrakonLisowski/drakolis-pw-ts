import http from 'http';
import config from '../../config';
import { BaseApplication } from '../BaseApplication';
import { Service } from '../../services/eService';
// tslint:disable-next-line: import-name
import LoggerService from '../../services/logger';

export default class WSHostService extends BaseApplication {

  private appLogger: LoggerService;
  private server: http.Server;

  public getName(): string {
    return 'SocketAPI';
  }

  public getRequiredServices(): Service[] {
    return [Service.Logger, Service.Postgress, Service.Websocket];
  }
  public async startApplication(): Promise<boolean> {
    this.appLogger = this.getRegistry()[Service.Logger];
    this.appLogger.info('Starting application...');

    return new Promise((res, rej) => {
      this.server.listen(
        config.wsHost.port,
        config.wsHost.host,
        () => {
          const socketTransport = this.getRegistry()[Service.Websocket];
          socketTransport.init(this.server);
          this.appLogger
            .info(`Application started @ ${config.wsHost.host}:${config.wsHost.port}!`);
          res(true);
        },
      );
    });
  }

  public isRunning() {
    return this.server.listening;
  }

  public async stop(): Promise<boolean> {
    this.appLogger.info('Stopping application...');
    return new Promise((res, rej) => {
      this.server.close();
      this.appLogger.info('Application stopped!');
      res(true);
    });
  }

}