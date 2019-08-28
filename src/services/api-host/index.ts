import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { IService } from '../IService';
import logger from '../../util/logger';
import config from '../../config';

export default class APIHostService implements IService {

  private serviceLogger = logger('HOST:API');
  private express = express();
  private isConnected: boolean = false;

  public getDependencies(): string[] {
    return ['postgress'];
  }
  public async startService(registry: any): Promise<boolean> {
    this.serviceLogger.info('Starting service...');

    this.express.use(compression());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));

    return new Promise((res, rej) => {
      this.express.listen(
        config.apiHost.port,
        config.apiHost.host,
        () => {
          this.serviceLogger
            .info(`Service started @ ${config.apiHost.host}:${config.apiHost.port}!`);
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
