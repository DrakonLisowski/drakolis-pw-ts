import bluebird from 'bluebird';
import { Type } from './ServiceDecorator';
import { ServiceInjector } from './ServiceInjector';

export abstract class LoaderService<T> {

  // this thing will start working on first load.
  public init: Promise<T>;

  protected instance: T;
  private dependencies: Type<any>[];

  constructor(...dependencies: Type<any>[]) {
    this.dependencies = dependencies;
    this.init = new Promise(async (res) => {
      await this.initDependencies();
      await this.initInstance();
      res(this.instance);
    });
  }

  public stop() {
    return true;
  }

  protected async initDependencies(): Promise<boolean> {
    await bluebird.map(
      this.dependencies,
      (depClass) => {
        const dependency = ServiceInjector.resolve<any>(depClass);
        if (dependency instanceof LoaderService) {
          return (dependency as LoaderService<any>).init;
        }
        return true;
      },
    );
    return true;
  }

  protected abstract initInstance(): Promise<boolean>|boolean;

}
