// tslint:disable-next-line: import-name
import TelegramBot from 'node-telegram-bot-api';
import { IService } from '../IService';
import { Service } from '../eService';
import config from '../../config';
// tslint:disable-next-line:import-name
import LoggerService from '../logger';

export default class TelegramBotService extends TelegramBot implements IService {

  private serviceLogger: LoggerService;

  constructor(private polling: boolean) {
    super(
      config.telegramConfig.telegramBotToken,
      { polling: { autoStart: false } },
    );
  }

  public getDependencies(): Service[] {
    return [Service.Logger];
  }

  public async start(registry: any): Promise<boolean> {
    this.serviceLogger = registry[Service.Logger].addLabel('TGBot');
    this.serviceLogger.info('Starting service...');
    if (this.polling) {
      await this.startPolling({

      });
    }
    this.serviceLogger.info('Service started!');
    return true;
  }

  public isRunning(): boolean {
    return !this.polling || this.isPolling();
  }

  public async stop(): Promise <boolean> {
    this.serviceLogger.info('Stopping service...');
    if (this.polling) {
      await this.stopPolling();
    }
    this.serviceLogger.info('Service stopped!');
    return true;
  }

}
