import { Type } from './ServiceDecorator';

// tslint:disable-next-line: new-parens
export const ServiceInjector = new class {
  public resolve<T>(target: Type<any>): T {
    // tokens are required dependencies, while injections are resolved tokens from the Injector
    const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
    const injections = tokens.map((token: Type<any>) => ServiceInjector.resolve<any>(token));

    return new target(...injections);
  }
};
