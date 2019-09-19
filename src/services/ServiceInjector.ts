import { Type } from './ServiceDecorator';

export const ServiceInjector = new class {

  // Contains already loaded stuff
  private injected: any[] = [];

  public resolve<T>(target: Type<any>): T {
    const loadedInstance = this.injected.find(injection => injection instanceof target);
    if (loadedInstance) {
      return loadedInstance;
    }
    // tokens are required dependencies, while injections are resolved tokens from the Injector
    const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
    const injections = tokens.map((token: Type<any>) => ServiceInjector.resolve<any>(token));
    const createdInstance = new target(...injections);

    this.injected.push(createdInstance);

    return createdInstance;
  }
}();
