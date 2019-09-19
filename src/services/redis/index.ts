import { IService } from '../../services/IService';
import { RedisClient } from 'redis';
import { Service } from '../ServiceDecorator';
import LoggerService from '../logger';

@Service()
export default class RedisService extends RedisClient implements IService {

  private serviceLogger: LoggerService;

  constructor() {
    super({
      host: '127.0.0.1',
      port: 6379,
    });
  }

  public async start(): Promise<boolean> {
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
