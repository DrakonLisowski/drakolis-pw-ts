import 'reflect-metadata';
import { createConnection } from 'typeorm';
import LoggerService from '../services/logger';
import dbSettingsBuilder from '../util/dbSettingsBuilder';

const log = new LoggerService().addLabel('Migrations');

const runScript = async () => {
  log.info('Connecting to DB...');
  let typeorm;
  try {
    typeorm = await createConnection(dbSettingsBuilder(log));
    log.info('DB connected!');
    await typeorm.runMigrations();
  } catch (e) {
    if (typeorm) {
      await typeorm.close();
    }
    throw e;
  }
};

runScript()
  .catch(e => {
    log.exception('Migrations failed!', e);
    process.exit(1);
  })
  .then(r => {
    log.info('Success!');
    process.exit(0);
  });
