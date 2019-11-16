import Command from '../Command';
import AuthorizationTokenRequest from '../../requests/AuthorizationTokenRequest';

export default new Command(AuthorizationTokenRequest, 'getUserByPlainToken', () => {});
