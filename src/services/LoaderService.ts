import bluebird from 'bluebird';
import { Type } from './ServiceDecorator';
import { ServiceInjector } from './ServiceInjector';

export default abstract class LoaderService<T> {

  protected instance: T;
  private dependencies: Type<any>[];
  private initiated: boolean = false;

  constructor(...dependencies: Type<LoaderService<any>>[]) {
    this.dependencies = dependencies;
  }

  public async init(...args: any) {
    if (!this.initiated) {
      await new Promise(async (res) => {
        await this.initDependencies();
        this.instance = await this.initInstance(...args);
        this.initiated = true;
        res(this.instance);
      });
    }
    return this.instance;
  }

  public stop() {
    return true;
  }

  protected reset() {
    this.initiated = false;
  }

  protected async initDependencies(): Promise<boolean> {
    await bluebird.map(
      this.dependencies,
      (depClass) => {
        const dependency = ServiceInjector.resolve<any>(depClass);
        return dependency.init;
      },
    );
    return true;
  }

  protected abstract initInstance(...args: any): Promise<T>|T;

}
