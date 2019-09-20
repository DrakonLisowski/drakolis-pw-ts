import TelegramBot from 'node-telegram-bot-api';
import { Service } from '../ServiceDecorator';
import config from '../../config';
import LoggerService from '../logger';
import { LoaderService } from '../LoaderService';

@Service()
export default class TelegramBotService extends LoaderService<TelegramBot> {

  constructor(private serviceLogger: LoggerService) {
    super(LoggerService);
  }

  protected initInstance(): boolean {
    this.instance = new TelegramBot(
      config.telegramConfig.telegramBotToken,
      { polling: { autoStart: false } },
    );
    this.serviceLogger.info('Service started!');
    return true;
  }

}
