import config from '../config';
import { Logger, QueryRunner, ConnectionOptions, QueryBuilder } from 'typeorm';
import { IDrakolisLogger } from './logger';

class DrakolisDBLogger implements Logger {
  constructor(private logger: IDrakolisLogger) {
    this.logger = this.logger.addLabel('SQL');
  }

  public logQuery(
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.debugSyntax(
      'sql',
      query,
      {
        postfix: this.postfixFormatter(parameters),
      },
    );
  }
  public logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.errorSyntax(
      'sql',
      query,
      {
        prefix: 'Querry failed:',
        postfix: this.postfixFormatter(parameters),
      },
    );
  }
  public logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.warnSyntax(
      'sql',
      query,
      {
        prefix: `Querry is slow (${time}ms):`,
        postfix: this.postfixFormatter(parameters),
      },
    );
  }
  public logSchemaBuild(
    message: string,
    queryRunner?: QueryRunner,
  ) {
    this.logger.info(message);
  }
  public logMigration(
    message: string,
    queryRunner?: QueryRunner,
  ) {
    this.logger.info(`Migration: ${message}`);
  }
  public log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner,
  ) {
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
    return parameters && `Parameters: ${parameters.map((p, i) => `${i + 1}=${p}`).join(', ')}`;
  }
}

export default (logger: IDrakolisLogger) => {
  return {
    ...config.postgress,
    type: 'postgres',
    name: 'postgres',
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    logging: true,
    logger: new DrakolisDBLogger(logger),
  } as ConnectionOptions;
};
