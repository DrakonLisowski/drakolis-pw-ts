import bluebird from 'bluebird';
import { IService } from '../services/IService';
import { ServiceInjector } from '../services/ServiceInjector';
import { Type } from '../services/ServiceDecorator';
import LoggerService from '../services/logger';

export abstract class BaseApplication {

  protected applicationLogger: LoggerService;

  public abstract getName(): string;
  public abstract getRequiredServices(): Type<IService>[];
  public abstract startApplication(): Promise<boolean>;
  public abstract isRunning(): boolean;
  public abstract stop(): Promise<boolean>;

  public getProcessId(): string {
    return process.env.pm_id || '-1';
  }

  public getLoggingLabel(): string {
    return `${this.getName()}:${this.getProcessId()}`;
  }

  public async start(): Promise<boolean> {
    await this.initServices();
    await this.startApplication();
    this.applicationLogger.info('Application is ready.');
    return true;
  }

  private async initServices() {
    // this is globally required service for now.
    this.applicationLogger = ServiceInjector.resolve<LoggerService>(LoggerService);
    this.applicationLogger = this.applicationLogger.addLabel(this.getLoggingLabel());
    this.applicationLogger.info('Application is starting...');

    await bluebird.map(
      this.getRequiredServices(),
      async (service: Type<IService>) => {
        const resolved = ServiceInjector.resolve<IService>(service);
        await resolved.start();
      },
      { concurrency: 1 },
    );
  }

}
