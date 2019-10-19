import { BadRequestError } from '../errors';
import { BaseRequest } from '../requests/BaseRequest';

export type CommandFunction = (data: BaseRequest) => Promise<any>;

export default class Command {
  constructor(
    private RequestType: new (data: any) => BaseRequest,
    private name: string,
    private commandFunction: CommandFunction
  ) {}

  public getName() {
    return this.name;
  }

  public getFunction() {
    const exec = async (data: any): Promise<any> => {
      const request = this.testArguments(data);
      return this.commandFunction(request);
    };
    return exec;
  }

  private testArguments(args: any) {
    const request = new this.RequestType(args);
    const errors = request.test();
    if (errors) {
      throw new BadRequestError(errors);
    }
    return request;
  }
}
