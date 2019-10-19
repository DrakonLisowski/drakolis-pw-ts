import BaseApplication from '../BaseApplication';
import post from './commands/post';
import { ServiceInjector } from '../../services/ServiceInjector';
import LoggerService from '../../services/logger';
import TelegramBotService from '../../services/telegramBot';
import PostgressService from '../../services/postgress';
import ContextService from '../../services/context';

export default class BotTGChannelManager extends BaseApplication {
  private applicationLogger: LoggerService;

  private botService: TelegramBotService;

  constructor() {
    super();
    const context = ServiceInjector.resolve<ContextService>(ContextService).addRootContext(
      this.getLoggingLabel(),
    );
    this.applicationLogger = ServiceInjector.resolve<LoggerService>(LoggerService).addLabels(
      context.getRootContext(),
    );
    this.botService = ServiceInjector.resolve<TelegramBotService>(TelegramBotService);
  }

  public getName(): string {
    return 'BotTGChannelManager';
  }

  public async startApplication(): Promise<boolean> {
    const pg = ServiceInjector.resolve<PostgressService>(PostgressService);
    pg.init();

    const bot = await this.botService.init(true);
    post(bot);
    this.applicationLogger.info('Application started.');
    return true;
  }

  public isRunning(): boolean {
    return true;
  }

  public async stop(): Promise<boolean> {
    return true;
  }
}
