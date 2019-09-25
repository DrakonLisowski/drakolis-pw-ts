import config from '../config';
import { ConnectionOptions } from 'typeorm';
import LoggerService from '../services/logger';

export default (logger: LoggerService) => {
  return {
    ...config.mongo,
    type: 'mongodb',
    name: 'mongo',
    entities: ['src/entities/mongo/*.ts'],
    migrations: ['src/migrations/mongo/*.ts'],
    subscribers: ['src/subscribers/mongo/*.ts'],
  } as ConnectionOptions;
};
