import {
  IConfig,
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  ServiceRegistryConfig,
  HostConfig,
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
  };

  public postgress: PostgressConfig = {
    host: 'localhost',
    port: 5432,
    username: 'drakolis',
    password: 'drakolis',
    database: 'drakolis-pw',
    schema: 'public',
  };

  public apiHost: HostConfig = {
    host: '127.0.0.1',
    port: 8080,
  };

  public wsHost: HostConfig = {
    host: '127.0.0.1',
    port: 8000,
  };
}
