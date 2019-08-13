import {
  IConfig,
  EnvironmentConfig,
  LogConfig,
  PostgressConfig,
  ServiceRegistryConfig,
} from '.';

export class ProductionConfig implements IConfig {
  public environment: EnvironmentConfig = 'prod';
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

  public serviceRegistry: ServiceRegistryConfig = {
    startingConcurrency: 10,
  };
}
