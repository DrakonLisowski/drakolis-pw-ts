import {
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  RedisConfig,
  ServiceRegistryConfig,
  HostConfig,
  TelegramConfig,
} from '.';

export interface IConfig {
  environment: EnvironmentConfig;
  logging: LogConfig;
  serviceRegistry: ServiceRegistryConfig;

  postgress: PostgressConfig;
  redis: RedisConfig;

  apiHost: HostConfig;
  wsHost: HostConfig;

  telegramConfig: TelegramConfig;
}
