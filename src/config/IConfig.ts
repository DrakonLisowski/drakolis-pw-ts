import {
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  RedisConfig,
  ServiceRegistryConfig,
  HostConfig,
  TelegramConfig,
  InstagramConfig,
  SecretsConfig,
} from '.';
import { MongoConfig, RTMPConfig } from './types';

export interface IConfig {
  environment: EnvironmentConfig;
  logging: LogConfig;
  serviceRegistry: ServiceRegistryConfig;

  postgress: PostgressConfig;
  mongo: MongoConfig;
  redis: RedisConfig;

  apiHost: HostConfig;
  wsHost: HostConfig;

  telegramConfig: TelegramConfig;
  instagramConfig: InstagramConfig;

  secretsConfig: SecretsConfig;

  rtmpConfig: RTMPConfig;
}
