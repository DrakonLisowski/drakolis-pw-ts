import Command from '../Command';
import { AlwaysFailError } from '../../errors';
import { AuthorizationTokenRequest } from '../../requests/AuthorizationTokenRequest';

export default new Command(AuthorizationTokenRequest, 'alwaysFail', async () => {
  throw new AlwaysFailError();
});
