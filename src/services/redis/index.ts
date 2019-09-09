import { IService } from '../../services/IService';
import { RedisClient } from 'redis';
import logger, { IDrakolisLogger } from '../../util/logger';

export default class RedisService extends RedisClient implements IService {

  private serviceLogger: IDrakolisLogger = logger('Redis');

  constructor() {
    super({
      host: '127.0.0.1',
      port: 6379,
    });
  }

  public getDependencies(): string[] {
    return [];
  }
  public async startService(registry: any): Promise<boolean> {
    this.serviceLogger.silly('Starting service...');
    // Well...
    this.serviceLogger.info('Service started!');
    return true;
  }
  public isRunning(): boolean {
    return true;
  }
  public async stopService(): Promise<boolean> {
    return true;
  }

}
