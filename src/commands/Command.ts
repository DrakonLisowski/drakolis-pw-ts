import { RequestParamsLike } from 'jayson';
import { UnathorizedError, BadRequestError } from '../errors';
import { BaseRequest } from '../requests/BaseRequest';

export type CommandFunction = (data: BaseRequest) => Promise<any>;

export class Command {

  private static checkAuth(data: any): boolean {
    if (data.token && data.token === 'DRAKOLIS-RULZ-OK') {
      return true;
    }
    throw new UnathorizedError();
  }

  constructor(
    private requestType: new (data: any) => BaseRequest,
    private name: string,
    private commandFunction: CommandFunction,
    private supportsSocket: boolean,
    private supportsHttp: boolean,
    private requireAuth?: boolean,
  ) {}

  public getName() {
    return this.name;
  }

  public getFunction() {
    let exec = (data: any): any => {
      const request = this.testArguments(data);
      return exec(data);
    };
    if (this.requireAuth) {
      exec = (data) => {
        Command.checkAuth(data);
        return exec(data);
      };
    }
    return exec;
  }

  private testArguments(args: any) {
    const request = new this.requestType(args);
    const errors = request.test();
    if (errors) {
      throw new BadRequestError(errors);
    }
    return request;
  }
}
