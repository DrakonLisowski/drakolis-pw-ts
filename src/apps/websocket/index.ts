import { Server } from 'http';
import express from 'express';
import config from '../../config';
import { BaseApplication } from '../BaseApplication';
import { Service } from '../../services/eService';
// tslint:disable-next-line: import-name
import LoggerService from '../../services/logger';

export default class WSHostService extends BaseApplication {

  private appLogger: LoggerService;
  private expressApp = express();
  private isConnected: boolean = false;

  public getName(): string {
    return 'SocketAPI';
  }

  public getRequiredServices(): Service[] {
    return [Service.Logger, Service.Postgress, Service.Websocket];
  }
  public async startApplication(): Promise<boolean> {
    this.appLogger = this.getRegistry()[Service.Logger];
    this.appLogger.info('Starting service...');

    this.expressApp.get('/*', (req: any, res: any) => {
      return res.status(418).send();
    });

    return new Promise((res, rej) => {
      this.expressApp.listen(
        config.wsHost.port,
        config.wsHost.host,
        () => {
          const socketTransport = this.getRegistry()[Service.Websocket];
          socketTransport.init(this.expressApp);
          this.appLogger
            .info(`Service started @ ${config.wsHost.host}:${config.wsHost.port}!`);
          res(true);
        },
      );
    });
  }

  public isRunning() {
    return this.isConnected;
  }

  public async stop(): Promise<boolean> {
    this.appLogger.info('Stopping service');
    return new Promise((res, rej) => {
      this.appLogger.info('Service stopped!');
      res(true);
    });
  }

}
