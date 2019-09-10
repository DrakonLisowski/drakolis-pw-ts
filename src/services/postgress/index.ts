import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { IService } from '../IService';
import { Service } from '../eService';
import dbSettingsBuilder from '../../util/dbSettingsBuilder';
// tslint:disable-next-line:import-name
import LoggerService from '../logger';

export default class PostgressService implements IService {

  private serviceLogger: LoggerService;
  private dbConnection: Connection;

  public getDependencies(): Service[] {
    return [Service.Logger];
  }

  public async start(registry: any): Promise<boolean> {
    this.serviceLogger = registry[Service.Logger].addLabel('Postgress');
    this.serviceLogger.info('Starting service...');
    return !!(
      await createConnection(dbSettingsBuilder(this.serviceLogger))
      .then((connection) => {
        this.dbConnection = connection;
        this.serviceLogger.info('Service started!');
        return true;
      })
      .catch((e) => {
        this.serviceLogger.exception('Starting failed', e);
        return false;
      })
    );
  }

  public isRunning(): boolean {
    return this.dbConnection.isConnected || false;
  }

  public stop(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

}

//
//
//
// import logger, { IDrakolisLogger } from '../logger/logger';
//

// export default class PostgressService

//   private serviceLogger: IDrakolisLogger;

//   constructor() {
//     const log = logger('Postgress');
//     super(dbSettingsBuilder(log));
//     this.serviceLogger = log;
//   }
//   public getDependencies(): string[] {
//     return [];
//   }

//   public async startService(registry: any): Promise<boolean> {

//   }

//   public isRunning() {
//     return this.isConnected;
//   }

//   public async stopService(): Promise<boolean> {
//     try {
//       await this.close();
//       return true;
//     } catch (e) {
//       return false;
//     }
//   }

// }
