import {
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  ServiceRegistryConfig,
} from '.';

export interface IConfig {
  environment: EnvironmentConfig;
  logging: LogConfig;
  postgress: PostgressConfig;
  serviceRegistry: ServiceRegistryConfig;
}
