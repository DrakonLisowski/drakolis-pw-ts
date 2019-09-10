import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import config from '../../config';
import { BaseApplication } from '../BaseApplication';
import { Service } from '../../services/eService';
// tslint:disable-next-line: import-name
import LoggerService from '../../services/logger';
import routes from './routes/justlol';
import { reset } from 'cls-hooked';

class InfoAPIApplication extends BaseApplication {

  private appLogger: LoggerService;
  private expressApp = express();

  public getName(): string {
    return 'InfoAPI';
  }

  public getRequiredServices(): Service[] {
    return [Service.Logger, Service.Postgress];
  }

  public async startApplication(): Promise<boolean> {
    this.appLogger = this.getRegistry()[Service.Logger];
    this.appLogger.info('Starting application...');
    this.expressApp.use(compression());
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: true }));

    routes(this.expressApp);

    this.expressApp.get('/*', (req: any, res: any) => {
      return res.status(418).send();
    });

    return new Promise((res) => {
      this.expressApp.listen(
        config.apiHost.port,
        config.apiHost.host,
        () => {
          this.appLogger
            .info(`Application started @ ${config.apiHost.host}:${config.apiHost.port}!`);
          res(true);
        },
      );
    });
  }

  public isRunning(): boolean {
    return true;
  }

  public async stop(): Promise<boolean> {
    return true;
  }

}

export default InfoAPIApplication;
