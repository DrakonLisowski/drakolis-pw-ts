import {
  IConfig,
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  ServiceRegistryConfig,
  ExpressConfig,
} from '.';

export class DevelopmentConfig implements IConfig {
  public environment: EnvironmentConfig = 'development';
  public logging: LogConfig = {
    console: true,
    file: true,
    fileName: 'drakolis-pw',
    level: 'silly',
  };

  public postgress: PostgressConfig = {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'drakolis_dev',
    schema: 'public',
  };

  public express: ExpressConfig = {
    host: '0.0.0.0',
    port: 8080,
  };

  public serviceRegistry: ServiceRegistryConfig = {
    startingConcurrency: 10,
  };
}
