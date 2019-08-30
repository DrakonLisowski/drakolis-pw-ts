import { Server } from 'http';
import express from 'express';
import { IService } from '../IService';
import logger from '../../util/logger';
import config from '../../config';
import SocketTransport from '../socket/SocketTransport';

export default class WSHostService implements IService {

  private serviceLogger = logger('HOST:WS');
  private express = express();
  private isConnected: boolean = false;

  public getDependencies(): string[] {
    return ['postgress', 'socket'];
  }
  public async startService(registry: any): Promise<boolean> {
    this.serviceLogger.info('Starting service...');

    this.express.get('/*', (req: any, res: any) => {
      return res.status(418).send();
    });

    return new Promise((res, rej) => {
      this.express.listen(
        config.wsHost.port,
        config.wsHost.host,
        () => {
          const socketTransport = registry.socket as SocketTransport;
          socketTransport.init(this.express);
          this.serviceLogger
            .info(`Service started @ ${config.wsHost.host}:${config.wsHost.port}!`);
          res(true);
        },
      );
    });
  }

  public isRunning() {
    return this.isConnected;
  }

  public async stopService(): Promise<boolean> {
    this.serviceLogger.info('Stopping service');
    return new Promise((res, rej) => {
      this.serviceLogger.info('Service stopped!');
      res(true);
    });
  }

}
