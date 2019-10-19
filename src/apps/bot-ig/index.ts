import { Connection } from 'typeorm';
import { IgApiClient } from 'instagram-private-api';
import { json } from 'body-parser';
import { BaseApplication } from '../BaseApplication';
import { ServiceInjector } from '../../services/ServiceInjector';
import LoggerService from '../../services/logger';
import ContextService from '../../services/context';
import MongoService from '../../services/mongo';
import IGUserFollower from '../../entities/mongo/IGUserFollower';
import InstaService from '../../services/instaService';
import IpcService from '../../services/ipc';

export default class BotIGApplication extends BaseApplication {
  private applicationLogger: LoggerService;

  private mongoService: MongoService;

  private instaService: InstaService;

  private ipcService: IpcService;

  private mongo: Connection;

  private IgApi: IgApiClient;

  private enabledApplication: boolean;

  constructor() {
    super();
    const context = ServiceInjector.resolve<ContextService>(ContextService).addRootContext(
      this.getLoggingLabel(),
    );
    this.applicationLogger = ServiceInjector.resolve<LoggerService>(LoggerService).addLabels(
      context.getRootContext(),
    );
    this.mongoService = ServiceInjector.resolve<MongoService>(MongoService);
    // this.instaService = ServiceInjector.resolve<InstaService>(InstaService);
    this.ipcService = ServiceInjector.resolve<IpcService>(IpcService);
  }

  public getName(): string {
    return 'BotIG';
  }

  public async startApplication(): Promise<boolean> {
    const nameIPC = 'igbot';
    const [mongo, ipcServer] = await Promise.all([
      // this.instaService.init(),
      this.mongoService.init(),
      this.ipcService.startServer(nameIPC),
    ]);
    this.applicationLogger.info(`Aplication botIG run`);
    this.mongo = mongo;
    // this.IgApi = IgApi;
    this.enabledApplication = true;
    // await this.ipcService.connectTo(nameIPC);
    await this.ipcService.onMessage((message, client) => {
      this.applicationLogger.info(`Message from ${client.name}: ${JSON.stringify(message)}`);
    });
    setInterval(async () => {
      this.ipcService.sendMessage(`from server kekekekekke`);
    }, 1000);
    return true;
  }

  public isRunning(): boolean {
    return this.enabledApplication;
  }

  public async stop(): Promise<boolean> {
    // this.instaService.stop();
    this.mongo.close();
    this.enabledApplication = false;
    return true;
  }
}
