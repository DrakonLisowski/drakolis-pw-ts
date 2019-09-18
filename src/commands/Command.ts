import { RequestParamsLike } from 'jayson';

export type CommandFunction = (data: RequestParamsLike) => Promise<any>;
export type TestingFunction = (data: RequestParamsLike) => any;

export class Command {
  constructor(
    private name: string,
    private commandFunction: CommandFunction,
    private requireAuth: boolean,
    private supportsSocket: boolean,
    private supportsHttp: boolean,
  ) {}

  public getName() {
    return this.name;
  }

  public getFunction() {
    return this.commandFunction;
  }

  private static checkAuth() {}

  private static testArguments() {}
}
