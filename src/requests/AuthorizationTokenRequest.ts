import { BaseRequest } from './BaseRequest';

export class AuthorizationTokenRequest implements BaseRequest {

  public token: string;

  constructor({ token }: any) {
    this.token = token;
  }

  public test(): object {
    const errors: any = {};
    if (!this.token) {
      errors.token = 'parameter missing';
    } else if (typeof this.token !== 'string') {
      errors.token = 'must be a string';
    }
    return Object.keys(errors).length > 0 && errors;
  }
}
