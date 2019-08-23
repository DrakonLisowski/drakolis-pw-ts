import 'reflect-metadata';
import { IService } from '../IService';
import { Connection } from 'typeorm';
import logger, { IDrakolisLogger } from '../../util/logger';
import dbSettingsBuilder from '../../util/dbSettingsBuilder';

export default class PostgressService extends Connection implements IService {

  private serviceLogger: IDrakolisLogger;

  constructor() {
    const log = logger('Postgress');
    super(dbSettingsBuilder(log));
    this.serviceLogger = log;
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
