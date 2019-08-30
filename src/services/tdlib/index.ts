import { IService } from '../IService';
import logger from '../../util/logger';
import config from '../../config';
import TDLibTransport from './TDLibTransport';

export default class TDLibService extends TDLibTransport implements IService {

  private serviceLogger = logger('TDLib');
  private isConnected: boolean = false;

  public getDependencies(): string[] {
    return [];
  }
  public async startService(registry: any): Promise<boolean> {
    this.serviceLogger.info('Starting service...');
    await this.init();
    this.serviceLogger.info(`Service started!`);
    return true;
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
