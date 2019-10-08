import {
  IConfig,
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  ServiceRegistryConfig,
  HostConfig,
  RedisConfig,
  TelegramConfig,
  MongoConfig,
  InstagramConfig,
} from '.';

export class DevelopmentConfig implements IConfig {
  public environment: EnvironmentConfig = 'development';
  public logging: LogConfig = {
    console: true,
    file: true,
    fileNamePrefix: 'dev',
    fileNamePostfix: 'drakolis-pw',
    level: 'silly',
  };

  public serviceRegistry: ServiceRegistryConfig = {
    startingConcurrency: 10,
    startingTimeout: 30 * 1000,
  };

  public postgress: PostgressConfig = {
    host: 'localhost',
    port: 5432,
    username: 'drakolis',
    password: 'dr@k0l1s',
    database: 'drakolis-dev',
    schema: 'public',
  };

  public mongo: MongoConfig = {
    host: 'localhost',
    port: 1701,
    database: 'instaService',
  };

  public redis: RedisConfig = {
    host: '127.0.0.1',
    port: 6379,
  };

  public apiHost: HostConfig = {
    host: '127.0.0.1',
    port: 8080,
  };

  public wsHost: HostConfig = {
    host: '127.0.0.1',
    port: 8000,
  };

  public telegramConfig: TelegramConfig = {
    appID: 0,
    appKey: '',
    tdLibAppPath: '',
    tdLibBinaryPath: '',

    telegramBotToken: process.env.TELEGRAM_CHANNEL_MANAGER_TOKEN,
    channelManagerChannel: -1001138267654,
    socket5: process.env.TELEGRAM_SOKET5,
    superAdminIds: [779631744],
  };

  public instagramConfig: InstagramConfig = {
    username:  process.env.IG_USERNAME,
    password:  process.env.IG_PASSWORD,
  };
}
