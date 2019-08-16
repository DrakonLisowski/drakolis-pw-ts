import {
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  ServiceRegistryConfig,
  ExpressConfig,
} from '.';

export interface IConfig {
  environment: EnvironmentConfig;
  logging: LogConfig;
  postgress: PostgressConfig;
  serviceRegistry: ServiceRegistryConfig;
  express: ExpressConfig;
}
