import { BaseApplication } from '../BaseApplication';
import commands from './commands';
import { IService } from '../../services/IService';
import { Type } from '../../services/ServiceDecorator';
import TelegramBotService from '../../services/telegramBot';
import { ServiceInjector } from '../../services/ServiceInjector';

export default class BotTGClaraApplication extends BaseApplication {

  public getName(): string {
    return 'BotTGClara';
  }

  public getRequiredServices(): Type<IService>[] {
    return [
      TelegramBotService,
    ];
  }
  public async startApplication(): Promise<boolean> {
    commands();
    return true;
  }

  public isRunning(): boolean {
    return true;
  }

  public async stop(): Promise<boolean> {
    return true;
  }

}
