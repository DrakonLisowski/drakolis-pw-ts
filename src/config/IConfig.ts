import {
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  ServiceRegistryConfig,
  ExpressConfig,
} from '.';
import { SocketConfig } from './types';

export interface IConfig {
  environment: EnvironmentConfig;
  logging: LogConfig;
  serviceRegistry: ServiceRegistryConfig;
  postgress: PostgressConfig;
  express: ExpressConfig;
  socket: SocketConfig;
}
