import { createConnection, Connection } from 'typeorm';
import { Service } from '../ServiceDecorator';
import LoggerService from '../logger';
import dbSettingsBuilder from '../../util/dbSettingsBuilder';
import { LoaderService } from '../LoaderService';

@Service()
export default class PostgressService extends LoaderService<Connection> {

  constructor(private serviceLogger: LoggerService) {
    super(LoggerService);
  }

  protected async initInstance(): Promise<boolean> {
    this.serviceLogger.info('Starting service...');
    return !!(
      await createConnection(dbSettingsBuilder(this.serviceLogger))
      .then((connection) => {
        this.instance = connection;
        this.serviceLogger.info('Service started!');
        return true;
      })
      .catch((e) => {
        this.serviceLogger.exception('Starting failed', e);
        return false;
      })
    );
  }

}
