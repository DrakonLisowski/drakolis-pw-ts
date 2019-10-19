import { BaseRequest } from './BaseRequest';

export class GetUserID implements BaseRequest {
  public userName: string;

  constructor({ userName }: any) {
    this.userName = userName;
  }

  public test(): object | boolean {
    return false;
  }
}
