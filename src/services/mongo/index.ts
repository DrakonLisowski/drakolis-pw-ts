import { createConnection, Connection } from 'typeorm';
import { Service } from '../ServiceDecorator';
import LoaderService from '../LoaderService';
import ContextService from '../context';
import LoggerService from '../logger';
import mongoSettingsBuilder from '../../util/mongoSettingsBuilder';
import { Test } from '../../entities/mongo/Test';

@Service()
export default class MongoService extends LoaderService<Connection> {
  constructor(private context: ContextService, private serviceLogger: LoggerService) {
    super();
    this.context.addSubContext(this, null, 'Mongo');
    this.serviceLogger = this.serviceLogger.addLabels(this.context.getContext(this));
  }

  protected async initInstance(): Promise<Connection> {
    this.serviceLogger.info('Starting service...');
    return createConnection(mongoSettingsBuilder(this.serviceLogger))
      .then(connection => {
        this.instance = connection;
        this.serviceLogger.info('Service started!');

        Test.useConnection(connection);

        return this.instance;
      })
      .catch(e => {
        this.serviceLogger.exception('Starting failed', e);
        return null;
      });
  }
}
