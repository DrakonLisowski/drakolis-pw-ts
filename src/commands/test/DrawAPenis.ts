import { Command } from '../Command';
import { AuthorizationTokenRequest } from '../../requests/AuthorizationTokenRequest';

export default new Command(
  AuthorizationTokenRequest,
  'drawAPenis',
  async () => '8===D',
  true,
  true,
  true,
);
