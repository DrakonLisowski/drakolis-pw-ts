import { Service } from '../ServiceDecorator';

@Service()
export default class ContextService {

  // TEMP: This variable shouldnt exist
  private rootContext: string;
  private contextMap: WeakMap<object, string[]> = new WeakMap();

  // TEMP: This method shouldnt exist
  public addRootContext(context: string) {
    this.rootContext = context;
  }

  public addContext(obj: object, context: string[]) {
    this.contextMap.set(obj, context);
  }

  public getContext(obj: object) {
    if (!this.contextMap.has(obj)) {
      return [];
    }
    return [this.rootContext, ...this.contextMap.get(obj)];
  }
}
