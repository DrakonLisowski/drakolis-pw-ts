import {
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  RedisConfig,
  ServiceRegistryConfig,
  HostConfig,
} from '.';

export interface IConfig {
  environment: EnvironmentConfig;
  logging: LogConfig;
  serviceRegistry: ServiceRegistryConfig;

  postgress: PostgressConfig;
  redis: RedisConfig;

  apiHost: HostConfig;
  wsHost: HostConfig;
}
