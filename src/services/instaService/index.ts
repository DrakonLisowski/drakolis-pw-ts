import { IgApiClient, UserFeed, AccountFollowersFeed } from 'instagram-private-api';
// tslint:disable-next-line: max-line-length
import {
  AccountRepositoryLoginResponseLogged_in_user,
  UserRepositoryInfoResponseUser,
  UserFeedResponseItemsItem,
} from 'instagram-private-api/dist/responses';
import fs from 'fs';
import { Service } from '../ServiceDecorator';
import ContextService from '../context';
import LoaderService from '../LoaderService';
import LoggerService from '../logger';
import config from '../../config';
import IGUserFollower from '../../entities/mongo/IGUserFollower';

@Service()
export default class InstaService extends LoaderService<IgApiClient> {
  private ig: IgApiClient;

  private username: string;

  private password: string;

  private loggedInUser: AccountRepositoryLoginResponseLogged_in_user;

  private cookiesFile: string;

  constructor(private context: ContextService, private serviceLogger: LoggerService) {
    super();
    this.context.addSubContext(this, null, 'insta service');
    this.serviceLogger = this.serviceLogger.addLabels(this.context.getContext(this));
    this.ig = new IgApiClient();
    this.cookiesFile = `${config.instagramConfig.cookies}/${config.instagramConfig.username}.json`;
    if (fs.existsSync(this.cookiesFile)) {
      const fileStore = this.loadCookies(this.cookiesFile);
      const { cookies, state } = JSON.parse(fileStore);
      this.serviceLogger.info(`Load cookies`);
      this.ig.state.deserializeCookieJar(cookies);
      this.ig.state.deviceString = state.deviceString;
      this.ig.state.deviceId = state.deviceId;
      this.ig.state.uuid = state.uuid;
      this.ig.state.phoneId = state.phoneId;
      this.ig.state.adid = state.adid;
      this.ig.state.build = state.build;
    } else {
      this.serviceLogger.info(`Generate device`);
      this.ig.state.generateDevice(config.instagramConfig.username);
    }
    this.ig.request.end$.subscribe(async () => {
      const newCookies = JSON.stringify(await this.ig.state.serializeCookieJar());
      const newState = {
        deviceString: this.ig.state.deviceString,
        deviceId: this.ig.state.deviceId,
        uuid: this.ig.state.uuid,
        phoneId: this.ig.state.phoneId,
        adid: this.ig.state.adid,
        build: this.ig.state.build,
      };
      this.saveCookies(this.cookiesFile, JSON.stringify({ cookies: newCookies, state: newState }));
    });
    this.username = config.instagramConfig.username;
    this.password = config.instagramConfig.password;
  }

  public async getUserID(username: string): Promise<number> {
    return await this.ig.user.getIdByUsername(username);
  }

  public async loadUser(UserId: number): Promise<UserRepositoryInfoResponseUser> {
    return await this.ig.user.info(UserId);
  }

  public async getUserFeed(userId: number): Promise<UserFeed> {
    return await this.ig.feed.user(userId);
  }

  public async loadUserFeed(feed: UserFeed): Promise<UserFeedResponseItemsItem[]> {
    return await feed.items();
  }

  public async getUserFolowersFeed(userId: number): Promise<AccountFollowersFeed> {
    return await this.ig.feed.accountFollowers(userId);
  }

  public async getUserFolowers(
    feed: AccountFollowersFeed,
    owner: number,
  ): Promise<IGUserFollower[]> {
    return new Promise(async (res, rej) => {
      const listFolowers: any = [];
      feed.items$.subscribe(
        folowers => {
          const buffer = folowers
            .filter(item => !item.is_private && !item.has_anonymous_profile_picture)
            .map(item => {
              return {
                owner,
                pk: item.pk,
                username: item.username,
                fullName: item.full_name,
                isPrivate: item.is_private,
                profilePicUrl: item.profile_pic_url,
                profilePicId: item.profile_pic_id,
                isVerified: item.is_verified,
                hasAnonymousProfilePicture: item.has_anonymous_profile_picture,
                latestReelMedia: item.latest_reel_media,
              };
            });
          listFolowers.push(...buffer);
        },
        error => {
          this.serviceLogger.error(error);
          rej(error);
        },
        () => {
          this.serviceLogger.info('Complete! Users loaded!');
          res(listFolowers);
        },
      );
    });
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

  private loadCookies(file: string): string {
    return fs.readFileSync(file, 'utf8');
  }

  private async saveCookies(file: string, data: string): Promise<void> {
    return fs.writeFileSync(file, data);
  }
}
