import http from 'http';
import config from '../../config';
import { BaseApplication } from '../BaseApplication';
import messages from './commandLoader';
import { ServiceInjector } from '../../services/ServiceInjector';
import LoggerService from '../../services/logger';
import SocketIOService from '../../services/websocket';
import ContextService from '../../services/context';

export default class WSHostService extends BaseApplication {

  private applicationLogger: LoggerService;
  private server: http.Server = new http.Server();
  private socketService: SocketIOService;

  constructor() {
    super();
    const context = ServiceInjector.resolve<ContextService>(ContextService)
      .addRootContext(this.getLoggingLabel());
    this.applicationLogger = ServiceInjector.resolve<LoggerService>(LoggerService)
      .addLabels(context.getRootContext());
    this.socketService = ServiceInjector.resolve<SocketIOService>(SocketIOService);
  }

  public getName(): string {
    return 'SocketAPI';
  }

  public async startApplication(): Promise<boolean> {
    this.applicationLogger.info('Starting application...');

    return new Promise((res, rej) => {
      this.server.listen(
        config.wsHost.port,
        config.wsHost.host,
        () => {
          messages(this.socketService.init(this.server));
          this.applicationLogger
            .info(`Application started @ ${config.wsHost.host}:${config.wsHost.port}!`);
          res(true);
        },
      );
    });
  }

  public isRunning() {
    return this.server.listening;
  }

  public async stop(): Promise<boolean> {
    this.applicationLogger.info('Stopping application...');
    return new Promise((res, rej) => {
      this.server.close();
      this.applicationLogger.info('Application stopped!');
      res(true);
    });
  }

}
