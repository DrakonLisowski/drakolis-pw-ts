import { IService } from '../IService';
import logger from '../../util/logger';

export default class TestTimeoutService implements IService {
  private isConnected: boolean = false;
  public getDependencies(): string[] {
    return [];
  }
  public async startService(registry: any): Promise<boolean> {
    logger('Test Service').info('Loading service');
    return new Promise(res => setTimeout(
      () => {
        this.isConnected = true;
        res(true);
        logger('Test Service').info('Service loaded!');
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
