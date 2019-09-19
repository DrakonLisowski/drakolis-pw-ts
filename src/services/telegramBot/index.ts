import TelegramBot from 'node-telegram-bot-api';
import { IService } from '../IService';
import { Service } from '../ServiceDecorator';
import config from '../../config';
import { ServiceInjector } from '../ServiceInjector';
import LoggerService from '../logger';

@Service()
export default class TelegramBotService extends TelegramBot implements IService {

  private serviceLogger: LoggerService;

  constructor() {
    super(
      config.telegramConfig.telegramBotToken,
      { polling: { autoStart: false } },
    );
  }

  public async turnOnPolling() {
    await this.startPolling({});
  }

  public async start(): Promise<boolean> {

    this.serviceLogger = ServiceInjector.resolve<LoggerService>(LoggerService)
      .addLabel('TGBot');
    this.serviceLogger.info('Starting service...');
    this.serviceLogger.info('Service started!');
    return true;
  }

  public isRunning(): boolean {
    return true;
  }

  public async stop(): Promise <boolean> {
    throw new Error('Mika lalka');
    return true;
  }

}
