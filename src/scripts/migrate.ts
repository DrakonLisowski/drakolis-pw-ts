import 'reflect-metadata';
import { Connection } from 'typeorm';
// tslint:disable-next-line: import-name
import LoggerService from '../services/logger';
import dbSettingsBuilder from '../util/dbSettingsBuilder';

const log = new LoggerService('Migrations');

let typeorm = new Connection(dbSettingsBuilder(log));
const runScript = async() => {
  log.info('Connecting to DB...');
  try {
    typeorm = await typeorm.connect();
    log.info('DB connected!');
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
