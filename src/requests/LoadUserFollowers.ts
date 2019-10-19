import { BaseRequest } from './BaseRequest';

export class LoadUserFollowers implements BaseRequest {
  public userID: number;

  constructor({ userID }: any) {
    this.userID = userID;
  }

  public test(): object | boolean {
    return false;
  }
}
