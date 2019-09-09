import commandLineArgs, { OptionDefinition } from 'command-line-args';
import { Application, appLoader } from './apps';
import logger from './util/logger';

const definitions: OptionDefinition[] = [
  {
    name: 'application',
    alias: 'a',
    type: String,
    defaultOption: true,
  },
];
const { application: applicationName } = commandLineArgs(definitions);

const loggerForRunner = logger('Runner');
const run = async () => {
  if (!applicationName) {
    loggerForRunner.error('Application parameter was not defined');
    process.exit(1);
  }
  if (!Object.values(Application).includes(applicationName)) {
    loggerForRunner.error(`Application '${applicationName}' was not found`);
    process.exit(1);
  }
  const application =
    Object.keys(Application)
      .find(
        k => Application[k as keyof typeof Application] === applicationName,
      ) as keyof typeof Application;

  const loggerForApplication = logger(application);
  const app = await appLoader(Application[application]).catch(
    (e) => {
      loggerForApplication.exception('Uncaught exception', e);
      process.exit(1);
    },
  );
  if (app) app();
};

run().then().catch();
