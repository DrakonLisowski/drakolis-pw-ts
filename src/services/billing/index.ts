import { IService } from '../IService';
import logger from '../../util/logger';

export default class TestTimeoutService implements IService {

  private serviceLogger = logger('Billing');
  private isConnected: boolean = false;
  public getDependencies(): string[] {
    return ['postgress'];
  }
  public async startService(registry: any): Promise<boolean> {
    this.serviceLogger.info('Starting service');
    return new Promise(res => setTimeout(
      () => {
        this.isConnected = true;
        res(true);
        this.serviceLogger.info('Service started!');
      },
      5000,
    ));
  }

  public isRunning() {
    return this.isConnected;
  }

  public async stopService(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

}
