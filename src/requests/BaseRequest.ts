export type TestingFunction = () => any;

export default abstract class BaseRequest {
  // eslint-disable-next-line
  constructor(data: any) {}

  public abstract test(): object | boolean;
}
