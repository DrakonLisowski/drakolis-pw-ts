// @ts-ignore
import { Client } from 'tglib/node';
import logger from '../../services/logger-scrapped!/logger';

export default class TDLibTransport {
  protected tdlib: Client;

  protected clients: Client[];

  private transportLogger = logger('TDLib');

  protected async init() {
    this.tdlib = new Client({
      apiId: 402920,
      apiHash: '',

      appDir: './tdlib/application',
      binaryPath: './tdlib/lib/libtdjson.1.4.0.dylib',
    });

    this.tdlib.registerCallback('td:update', (update: any) => {
      this.transportLogger.debugSyntax('json', JSON.stringify(update));
    });

    this.tdlib.registerCallback('td:error', (error: any) => {
      this.transportLogger.errorSyntax('json', JSON.stringify(error));
    });

    // Save tglib default handler which prompt input at console
    const defaultHandler = this.tdlib.callbacks['td:getInput'];

    // Register own callback for returning auth details
    this.tdlib.registerCallback('td:getInput', async (args: any) => {
      this.transportLogger.debugSyntax('json', JSON.stringify(args));
      if (args.string === 'tglib.input.AuthorizationType') {
        return 'user';
      }
      if (args.string === 'tglib.input.AuthorizationValue') {
        return '+79811240017';
      }
      return await defaultHandler(args);
    });

    await this.tdlib.ready;
    this.transportLogger.info('Telegram connected');
  }
}
