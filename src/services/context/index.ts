import { Service } from '../ServiceDecorator';

@Service()
export default class ContextService {

  private contextMap: WeakMap<object, string[]> = new WeakMap();

  public addContext(obj: object, context: string[]) {
    this.contextMap.set(obj, context);
  }

  public getContext(obj: object) {
    if (!this.contextMap.has(obj)) {
      return [];
    }
    return this.contextMap.get(obj);
  }
}
