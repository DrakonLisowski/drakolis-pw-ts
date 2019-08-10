import 'reflect-metadata';
import { IService } from '../IService';
import { Connection } from 'typeorm';
import config from '../../config';
import logger from '../../util/logger';

export default class PostgressService extends Connection implements IService {

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
    return ['test'];
  }

  public async startService(registry: any): Promise<boolean> {
    logger('Postgress Service').info('Loading service');
    return !!(
      await this.connect().then(() => {
        logger('Postgress Service').info('Loading service');
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
