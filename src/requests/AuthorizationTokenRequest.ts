import { BaseRequest } from './BaseRequest';
import { UnathorizedError } from '../errors';

export class AuthorizationTokenRequest implements BaseRequest {
  public token: string;

  constructor({ token }: any) {
    this.token = token;
  }

  public test(): object|boolean {
    const errors: any = {};
    if (!this.token) {
      errors.token = 'parameter missing';
    } else if (typeof this.token !== 'string') {
      errors.token = 'must be a string';
    }
    // Plain token test is shitty!
    if (this.token !== 'DRAKOLIS-RULZ-OK') {
      throw new UnathorizedError();
    }

    return Object.keys(errors).length > 0 && errors;
  }
}
