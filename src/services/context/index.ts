import { Service } from '../ServiceDecorator';

@Service()
export default class ContextService {

  private contextMap: WeakMap<object, string[]> = new WeakMap();

  public addRootContext(context: string[]|string) {
    this.addContext(null, context);
    return this;
  }

  public getRootContext(): string[] {
    if (this.contextMap.has(null)) {
      return this.contextMap.get(null);
    }
    return [];
  }

  public addSubContext(obj: object, parent: object = null, newContext: string[]|string = []) {
    const parentContext = this.getContext(parent);
    this.addContext(obj, [...parentContext, ...newContext]);
  }

  public addContext(obj: object, newContext: string[]|string) {
    let context = Array.isArray(newContext) ? newContext : [newContext];

    if (!this.contextMap.has(obj)) {
      context = [...this.contextMap.get(obj), ...context];
    }

    this.contextMap.set(obj, context);
    return this;
  }

  public getContext(obj: object): string[] {
    if (!this.contextMap.has(obj)) {
      return [...this.getRootContext()];
    }
    return [...this.getRootContext(), ...this.contextMap.get(obj)];
  }
}
