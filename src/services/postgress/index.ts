import 'reflect-metadata';
import { IService } from '../IService';
import { Connection } from 'typeorm';
import config from '../../config';
import logger from '../../util/logger';

export default class PostgressService extends Connection implements IService {

  private serviceLogger = logger('ExpressAPI');

  constructor() {
    super({
      ...config.postgress,
      type: 'postgres',
      name: 'postgres',
      entities: ['src/entity/**/*.ts'],
      migrations: ['src/migration/**/*.ts'],
      subscribers: ['src/subscriber/**/*.ts'],
      logging: true,
      logger: 'advanced-console',
    });
  }
  public getDependencies(): string[] {
    return [];
  }

  public async startService(registry: any): Promise<boolean> {
    this.serviceLogger.info('Starting service');
    return !!(
      await this.connect().then(() => {
        this.serviceLogger.info('Service started!');
        return true;
      })
    );
  }

  public isRunning() {
    return this.isConnected;
  }

  public async stopService(): Promise<boolean> {
    try {
      await this.close();
      return true;
    } catch (e) {
      return false;
    }
  }

}
