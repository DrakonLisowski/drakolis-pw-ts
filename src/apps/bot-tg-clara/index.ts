import { BaseApplication } from '../BaseApplication';
import post from './commands/post';
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
    const bot = ServiceInjector.resolve<TelegramBotService>(TelegramBotService);
    post(bot);
    return true;
  }

  public isRunning(): boolean {
    return true;
  }

  public async stop(): Promise<boolean> {
    return true;
  }

}
