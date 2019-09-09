import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import logger from '../../util/logger';
import config from '../../config';

const appLogger = logger(`InfoAPI:${process.env.pm_id || -1}`);
const expressApp = express();

const run = () => {
  appLogger.info('Starting service...');

  expressApp.use(compression());
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: true }));
  expressApp.use((_rq, _rs, next) => {
    appLogger.info('i did it');
    next();
  });

  expressApp.get('/*', (req: any, res: any) => {
    return res.status(418).send();
  });

  expressApp.listen(
    config.apiHost.port,
    config.apiHost.host,
    () => {
      appLogger
        .info(`Service started @ ${config.apiHost.host}:${config.apiHost.port}!`);
    },
  );
};

export default run;
