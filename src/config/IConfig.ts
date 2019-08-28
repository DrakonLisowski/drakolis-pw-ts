import {
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  ServiceRegistryConfig,
  HostConfig,
} from '.';

export interface IConfig {
  environment: EnvironmentConfig;
  logging: LogConfig;
  serviceRegistry: ServiceRegistryConfig;
  postgress: PostgressConfig;

  apiHost: HostConfig;
  wsHost: HostConfig;
}
