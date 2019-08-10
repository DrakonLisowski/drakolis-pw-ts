
// tslint:disable: max-classes-per-file
export type EnvironmentConfig = 'prod'|'dev';
export type LogLevel = 'error'|'warn'|'info'|'verbose'|'debug'|'silly';
export class LogConfig {
  public console: boolean;
  public file: boolean;
  public fileName: string;
  public level: LogLevel;
}
export class ServiceRegistryConfig {
  public startingConcurrency: number;
}
export class PostgressConfig {
  public host: string;
  public port: number;
  public username: string;
  public password: string;
  public database: string;
  public schema: string;
}
