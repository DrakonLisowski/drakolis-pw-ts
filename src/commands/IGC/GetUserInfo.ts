import Command from '../Command';
import { GetUserInfo } from '../../requests/GetUserInfo';
import { ServiceInjector } from '../../services/ServiceInjector';
import InstaService from '../../services/instaService';
import LoggerService from '../../services/logger';
import ContextService from '../../services/context';
const insta = ServiceInjector.resolve<InstaService>(InstaService);
const context = ServiceInjector.resolve<ContextService>(ContextService)
  .addSubContext(this, null, 'RPC IG getUserInfo');
const logger = ServiceInjector.resolve<LoggerService>(LoggerService)
  .addLabels(context.getContext(this));

export default new Command(GetUserInfo, 'getUserInfo', async (data: GetUserInfo) => {
  return await insta.loadUser(data.userID);
});
