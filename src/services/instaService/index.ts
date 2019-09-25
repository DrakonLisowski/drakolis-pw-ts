import { IgApiClient, UserFeed } from 'instagram-private-api';
// tslint:disable-next-line: max-line-length
import { AccountRepositoryLoginResponseLogged_in_user, UserRepositoryInfoResponseUser, UserFeedResponseItemsItem } from 'instagram-private-api/dist/responses';
import { Service } from '../ServiceDecorator';
import ContextService from '../context';
import LoaderService from '../LoaderService';
import LoggerService from '../logger';
import config from '../../config';

@Service()
export default class InstaService  extends LoaderService<IgApiClient> {
  private ig: IgApiClient;
  private username: string;
  private password: string;
  private loggedInUser: AccountRepositoryLoginResponseLogged_in_user;

  constructor(
    private context: ContextService,
    private serviceLogger: LoggerService,
  ) {
    super();
    this.context.addSubContext(this, null, 'insta service');
    this.serviceLogger = this.serviceLogger.addLabels(this.context.getContext(this));
    this.ig =  new IgApiClient();
    this.ig.state.generateDevice(config.instagramConfig.username);
    this.username = config.instagramConfig.username;
    this.password = config.instagramConfig.password;
  }
  public async getUserID(username: string): Promise<number> {
    return await this.ig.user.getIdByUsername(username);
  }
  public async loadUser (UserId: number): Promise<UserRepositoryInfoResponseUser> {
    return await this.ig.user.info(UserId);
  }
  public async getUserFeed(userId: number): Promise<UserFeed> {
    return await this.ig.feed.user(userId);
  }
  public async loadUserFeed(feed: UserFeed): Promise<UserFeedResponseItemsItem[]> {
    return await feed.items();
  }
  protected async initInstance(): Promise<IgApiClient> {
    try {
      this.serviceLogger.info('Starting service IG API');
      await this.ig.simulate.preLoginFlow();
      this.loggedInUser = await this.ig.account.login(this.username, this.password);
      await this.ig.simulate.postLoginFlow();
      this.serviceLogger.info('Started service IG API');
    } catch (e) {
      this.serviceLogger.error(e);
      return null;
    }
    return this.ig;
  }

}
