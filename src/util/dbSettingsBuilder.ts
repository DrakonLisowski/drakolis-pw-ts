import { Logger, QueryRunner, ConnectionOptions } from 'typeorm';
import config from '../config';
import LoggerService from '../services/logger';

class DBLogger implements Logger {
  constructor(private logger: LoggerService) {
    this.logger = this.logger.addLabel('SQL');
  }

  public logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.debugSyntax('sql', query, {
      postfix: this.postfixFormatter(parameters),
    });
  }

  public logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.errorSyntax('sql', query, {
      prefix: 'Querry failed:',
      postfix: this.postfixFormatter(parameters),
    });
  }

  public logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.warnSyntax('sql', query, {
      prefix: `Querry is slow (${time}ms):`,
      postfix: this.postfixFormatter(parameters),
    });
  }

  public logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.info(message);
  }

  public logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.info(`Migration: ${message}`);
  }

  public log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    switch (level) {
      case 'log':
        this.logger.verbose(message);
      case 'info':
        this.logger.info(message);
      case 'warn':
        this.logger.warn(message);
    }
  }

  private postfixFormatter(parameters?: any[]) {
    return (
      parameters &&
      `Parameters: ${parameters.map((p, i) => `${i + 1}=${JSON.stringify(p)}`).join(', ')}`
    );
  }
}

export default (logger: LoggerService) => {
  return {
    ...config.postgress,
    type: 'postgres',
    name: 'default',
    entities: ['src/entities/*.ts'],
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
    logging: true,
    logger: new DBLogger(logger),
  } as ConnectionOptions;
};
