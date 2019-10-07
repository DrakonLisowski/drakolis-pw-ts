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
  SecretsConfig,
  RTMPConfig,
} from '.';

export class ProductionConfig implements IConfig {
  public environment: EnvironmentConfig = 'production';
  public logging: LogConfig = {
    console: true,
    file: true,
    fileNamePrefix: 'live',
    fileNamePostfix: 'drakolis-pw',
    level: 'info',
  };

  public serviceRegistry: ServiceRegistryConfig = {
    startingConcurrency: 10,
    startingTimeout: 5 * 1000,
  };

  public postgress: PostgressConfig = {
    host: 'localhost',
    port: 5432,
    username: 'drakolis',
    password: 'drakolis',
    database: 'drakolis-pw',
    schema: 'public',
  };

  public mongo: MongoConfig = {
    host: '',
    port: 0,
    database: '',
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
    channelManagerChannel: -1001315453164,

    superAdminIds: [779631744],
  };
  public instagramConfig: InstagramConfig = {
    username:  process.env.IG_USERNAME,
    password:  process.env.IG_PASSWORD,
  };

  public secretsConfig: SecretsConfig = {
    environmentSecret: process.env.SECRETS_CONFIG_ENV,
  };

  public rtmpConfig: RTMPConfig = {
    port: 1935,
    chunkSize: 60000,
    gopCache: true,
    ping: 60,
    pingTimeout: 30,
    httpPort: 1701,
    allowOrigin: '*',
  };
}
