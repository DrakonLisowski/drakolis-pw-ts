import 'reflect-metadata';
import { Connection } from 'typeorm';
import bluebird from 'bluebird';
import config from '../config';
import logger from '../util/logger';

const log = logger('Migrations', 'migrations');

const direction = 'down';

const typeorm = new Connection({
  ...config.postgress,
  type: 'postgres',
  name: 'postgres',
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  logging: true,
  logger: 'advanced-console',
});
const runScript = async() => {
  try {
    await typeorm.connect();
    log.info('DB connected!');
    log.debug(`Migrations: ${typeorm.migrations}`);
    return bluebird.map(
      typeorm.migrations,
      async (migration) => {
        log.info(`Running: ${typeof migration}`);
        const runner = typeorm.createQueryRunner('master');
        await migration[direction](runner);
      },
    );
  } catch (e) {
    typeorm.close();
    throw e;
  }
};

runScript().catch((e) => {
  log.exception('Migrations failed!', e);
  process.exit(1);
}).then((r) => {
  log.info('Success!');
  process.exit(0);
});
