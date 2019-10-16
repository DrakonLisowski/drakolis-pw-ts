import TelegramBot, { ConstructorOptions } from 'node-telegram-bot-api';
import { Service } from '../ServiceDecorator';
import LoaderService from '../LoaderService';
import config from '../../config';
import ContextService from '../context';
import LoggerService from '../logger';
// @ts-ignore
import socksAgent from 'socks-proxy-agent';

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
    const params = {
      polling: { autoStart: false },
      request: {},
    };
    if (config.telegramConfig.socket5) {
      // @ts-ignore
      params.request.agent = new socksAgent(config.telegramConfig.socket5);
    }
    this.instance = new TelegramBot(
      config.telegramConfig.telegramBotToken,
      params as ConstructorOptions,
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
    return this.instance;
  }

}
