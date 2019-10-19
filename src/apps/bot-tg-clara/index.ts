import { BaseApplication } from '../BaseApplication';
import commands from './commands';
import { ServiceInjector } from '../../services/ServiceInjector';
import LoggerService from '../../services/logger';
import ContextService from '../../services/context';

export default class BotTGClaraApplication extends BaseApplication {
  private applicationLogger: LoggerService;

  constructor() {
    super();
    const context = ServiceInjector.resolve<ContextService>(ContextService).addRootContext(
      this.getLoggingLabel()
    );
    this.applicationLogger = ServiceInjector.resolve<LoggerService>(LoggerService).addLabels(
      context.getRootContext()
    );
  }

  public getName(): string {
    return 'BotTGClara';
  }

  public async startApplication(): Promise<boolean> {
    await commands();
    return true;
  }

  public isRunning(): boolean {
    return true;
  }

  public async stop(): Promise<boolean> {
    return true;
  }
}
