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
  postgress: PostgressConfig;
  serviceRegistry: ServiceRegistryConfig;
  express: ExpressConfig;
  socket: SocketConfig;
}
