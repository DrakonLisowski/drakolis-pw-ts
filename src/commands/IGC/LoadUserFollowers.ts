import Command from '../Command';
import { LoadUserFollowers } from '../../requests/LoadUserFollowers';
import { ServiceInjector } from '../../services/ServiceInjector';
import InstaService from '../../services/instaService';
import LoggerService from '../../services/logger';
import ContextService from '../../services/context';
import MongoService from '../../services/mongo';
import IGUserFollower from '../../entities/mongo/IGUserFollower';

const insta = ServiceInjector.resolve<InstaService>(InstaService);
const mongo = ServiceInjector.resolve<MongoService>(MongoService).init();

const context = ServiceInjector.resolve<ContextService>(ContextService).addSubContext(
  this,
  null,
  'RPC IG loadUserFollowers',
);
const logger = ServiceInjector.resolve<LoggerService>(LoggerService).addLabels(
  context.getContext(this),
);

export default new Command(
  LoadUserFollowers,
  'loadUserFollowers',
  async (data: LoadUserFollowers) => {
    const feed = await insta.getUserFolowersFeed(data.userID);
    const followers = await insta.getUserFolowers(feed, data.userID);
    const folowersRep = (await mongo).getMongoRepository(IGUserFollower);
    await Promise.all(
      followers.map(follower => {
        folowersRep.updateOne(
          { owner: follower.owner, pk: follower.pk },
          { $set: follower },
          { upsert: true },
        );
      }),
    );
    return { countFollowersLoad: followers.length };
  },
);
