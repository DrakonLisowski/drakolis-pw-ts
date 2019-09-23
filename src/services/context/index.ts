import { Service } from '../ServiceDecorator';

@Service()
export default class ContextService {

  private static normalizeStringArguments(args: string[]|string) {
    return Array.isArray(args) ? args : [args];
  }

  private contextMap: WeakMap<object, string[]> = new WeakMap();

  /**
   * Adds context to root element
   * @param context context to add
   */
  public addRootContext(context: string[]|string) {
    this.addContext(this, context);
    return this;
  }

  /**
   * Gets context of a root element
   */
  public getRootContext(): string[] {
    if (this.contextMap.has(this)) {
      return this.contextMap.get(this);
    }
    return [];
  }

  /**
   * Creates new context for an object, adding to context of a parent
   * @param obj object to create context for
   * @param parent parent to extend, null for root element
   * @param newContext new values added to parent's context
   */
  public addSubContext(obj: object, parent: object = null, newContext: string[]|string = []) {
    const context = ContextService.normalizeStringArguments(newContext);

    const parentContext = this.getContext(parent || this);
    this.addContext(obj, [...parentContext, ...context]);
    return this;
  }

  /**
   * Gets context of an object
   * @param obj object to get context of
   */
  public getContext(obj: object): string[] {
    if (!this.contextMap.has(obj)) {
      return [];
    }
    return [...this.contextMap.get(obj)];
  }

  /**
   * Creates or adds context to an object.
   * This should probably be used only in special situations,
   * because the context of this object wont extend root context
   * @param obj object to create/add context for
   * @param newContext context values
   */
  public addContext(obj: object, newContext: string[]|string) {
    let context = ContextService.normalizeStringArguments(newContext);

    if (this.contextMap.has(obj)) {
      context = [...this.contextMap.get(obj), ...context];
    }

    this.contextMap.set(obj, context);
    return this;
  }
}
