import { Server } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import socketIo from 'socket.io';
import { IService } from '../IService';
import logger from '../../util/logger';
import config from '../../config';

export default class SocketService implements IService {

  private serviceLogger = logger('Socket');
  private express = express();
  private socket: any = null;
  private isConnected: boolean = false;

  public getDependencies(): string[] {
    return ['postgress'];
  }
  public async startService(registry: any): Promise<boolean> {
    this.serviceLogger.info('Starting service...');

    this.express.get('/*', (req: any, res: any) => {
      return res.status(418).send();
    });

    return new Promise((res, rej) => {
      this.express.listen(
        config.socket.port,
        config.socket.host,
        () => {
          this.socket = socketIo(new Server(this.express));
          this.serviceLogger
            .info(`Service started @ ${config.socket.host}:${config.socket.port}!`);
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
