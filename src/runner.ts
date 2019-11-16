import 'reflect-metadata';
import * as dotenv from 'dotenv';

import commandLineArgs, { OptionDefinition } from 'command-line-args';
import { Application, appLoader } from './apps';

dotenv.config();

process.env.NTBA_FIX_319 = 'yes';

const definitions: OptionDefinition[] = [
  {
    name: 'application',
    alias: 'a',
    type: String,
    defaultOption: true,
  },
];
const { application: applicationName } = commandLineArgs(definitions);

const run = async () => {
  if (!applicationName) {
    throw new Error('Application parameter was not defined');
  }
  if (!Object.values(Application).includes(applicationName)) {
    throw new Error(`Application '${applicationName}' was not found`);
  }
  const application = Object.keys(Application).find(
    k => Application[k as keyof typeof Application] === applicationName,
  ) as keyof typeof Application;

  const AppClass = await appLoader(Application[application]);
  if (AppClass) {
    const APP = new AppClass();
    await APP.start().catch(e => {
      throw e;
    });
  }
};

run()
  .then()
  .catch();
