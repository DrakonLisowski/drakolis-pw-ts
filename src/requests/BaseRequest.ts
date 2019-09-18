export type TestingFunction = () => any;

export abstract class BaseRequest {

  // tslint:disable-next-line: no-empty
  constructor(data: any) {}

  public abstract test(): object;
}
