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
    host: '',
    port: 0,
    username: '',
    password: '',
    database: '',
    schema: '',
  };

  public serviceRegistry: ServiceRegistryConfig = {
    startingConcurrency: 10,
  };
}
