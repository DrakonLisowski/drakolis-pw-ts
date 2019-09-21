import TelegramBot from 'node-telegram-bot-api';
import { Service } from '../ServiceDecorator';
import LoaderService from '../LoaderService';
import config from '../../config';
import ContextService from '../context';
import LoggerService from '../logger';

@Service()
export default class TelegramBotService extends LoaderService<TelegramBot> {

  constructor(
    private context: ContextService,
    private serviceLogger: LoggerService,
  ) {
    super();
    this.context.addSubContext(this, null, 'TGBot');
    this.serviceLogger = this.serviceLogger.addLabels(this.context.getContext(this));
  }

  // HACK:: This wraps parameter to be named
  public async init(polling: boolean = false) {
    return super.init(polling);
  }

  protected async initInstance(polling: boolean = false) {
    this.instance = new TelegramBot(
      config.telegramConfig.telegramBotToken,
      { polling: { autoStart: false } },
    );
    this.serviceLogger.info('Bot ready.');
    if (polling) {
      this.serviceLogger.info('Enabling polling...');
      this.serviceLogger.warn(
        'This might die if there is another polling for the same bot already!',
      );
      await this.instance.startPolling();
      this.serviceLogger.info('Polling enabled.');
    }
    return true;
  }

}
