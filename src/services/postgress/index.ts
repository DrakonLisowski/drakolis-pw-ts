import { createConnection, Connection } from 'typeorm';
import dbSettingsBuilder from '../../util/dbSettingsBuilder';
import { Service } from '../ServiceDecorator';
import LoaderService from '../LoaderService';
import ContextService from '../context';
import LoggerService from '../logger';

@Service()
export default class PostgressService extends LoaderService<Connection> {

  constructor(
    private context: ContextService,
    private serviceLogger: LoggerService,
  ) {
    super();
    this.context.addSubContext(this, null, 'Postgress');
    this.serviceLogger = this.serviceLogger.addLabels(this.context.getContext(this));
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
