import jayson from 'jayson';
import config from '../../config';
import { BaseApplication } from '../BaseApplication';
import { Type } from '../../services/ServiceDecorator';
import TelegramBotService from '../../services/telegramBot';
import PostgressService from '../../services/postgress';
import commandLoader from './commandLoader';

export default class HttpAPIApplication extends BaseApplication {

  private server: jayson.Server;

  public getName(): string {
    return 'InfoAPI';
  }

  public getRequiredServices(): Type<any>[] {
    return [PostgressService];
  }

  public async startApplication(): Promise<boolean> {
    this.server = new jayson.Server(commandLoader());

    return new Promise((res) => {
      this.server.http().listen(
        config.apiHost.port,
        config.apiHost.host,
        () => {
          this.applicationLogger
            .info(`Application started @ ${config.apiHost.host}:${config.apiHost.port}!`);
          res(true);
        },
      );
    });
  }

  public isRunning(): boolean {
    return this.server.http().listening;
  }

  public async stop(): Promise<boolean> {
    this.applicationLogger.info('Stopping application...');
    return new Promise((res, rej) => {
      this.server.http().close();
      this.applicationLogger.info('Application stopped!');
      res(true);
    });
  }

}
