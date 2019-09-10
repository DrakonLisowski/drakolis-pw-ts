import 'reflect-metadata';
import { Connection } from 'typeorm';
import logger from '../services/logger/logger';
import dbSettingsBuilder from '../util/dbSettingsBuilder';

const log = logger('Migrations', 'migrations');

const typeorm = new Connection(dbSettingsBuilder(log));
const runScript = async() => {
  log.info('Connecting to DB...');
  try {
    await typeorm.connect();
    log.info('DB connected!');
    await typeorm.undoLastMigration();
    await typeorm.runMigrations();
  } catch (e) {
    await typeorm.close();
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
