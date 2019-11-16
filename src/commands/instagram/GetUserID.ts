import Command from '../Command';
import GetUserID from '../../requests/GetUserID';
import { ServiceInjector } from '../../services/ServiceInjector';
// import InstaService from '../../services/instaService';
import LoggerService from '../../services/logger';
import ContextService from '../../services/context';
// const insta = ServiceInjector.resolve<InstaService>(InstaService);
const context = ServiceInjector.resolve<ContextService>(ContextService).addSubContext(
  this,
  null,
  'RPC IG getUserID',
);
const logger = ServiceInjector.resolve<LoggerService>(LoggerService).addLabels(
  context.getContext(this),
);

export default new Command(GetUserID, 'getUserID', async (data: GetUserID) => {
  // const userID = await insta.getUserID(data.userName);
  // return { userID };
  return `test`;
});
