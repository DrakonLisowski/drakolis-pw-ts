import { IService } from '../../services/IService';
import { RedisClient } from 'redis';
import { Service } from '../eService';
// tslint:disable-next-line: import-name
import LoggerService from '../logger';

export default class RedisService extends RedisClient implements IService {

  private serviceLogger: LoggerService;

  constructor() {
    super({
      host: '127.0.0.1',
      port: 6379,
    });
  }

  public getDependencies(): Service[] {
    return [];
  }
  public async start(registry: any): Promise<boolean> {
    this.serviceLogger.silly('Starting service...');
    // Well...
    this.serviceLogger.info('Service started!');
    return true;
  }
  public isRunning(): boolean {
    return true;
  }
  public async stop(): Promise<boolean> {
    return true;
  }

}
