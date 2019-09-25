import {
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  RedisConfig,
  ServiceRegistryConfig,
  HostConfig,
  TelegramConfig,
} from '.';
import { MongoConfig } from './types';

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
}
