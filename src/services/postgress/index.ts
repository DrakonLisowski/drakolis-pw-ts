import { createConnection, Connection } from 'typeorm';
import { IService } from '../IService';
import { Service } from '../ServiceDecorator';
import LoggerService from '../logger';
import dbSettingsBuilder from '../../util/dbSettingsBuilder';
import { ServiceInjector } from '../ServiceInjector';

@Service()
export default class PostgressService implements IService {

  private serviceLogger: LoggerService;
  private dbConnection: Connection;

  public async start(): Promise<boolean> {
    this.serviceLogger = ServiceInjector.resolve<LoggerService>(LoggerService)
      .addLabel('Postgress');
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
