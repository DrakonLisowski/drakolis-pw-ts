// @ts-ignore
import { Client } from 'tglib/node';
import logger from '../../util/logger';

export default class TDLibTransport {
  protected tdlib: Client;
  private transportLogger = logger('TDLib');

  protected async init() {
    this.tdlib = new Client({
      apiId: ' 402920',
      apiHash: '33851a17de4a4038084636c09fcbfb51',
      verbosityLevel: 1023,
      tdlibParameters: {},

      appDir: './tdlib/application',
      binaryPath: './tdlib/lib/libtdjson.1.4.0.dylib',
    });
    await this.tdlib.ready;
    this.transportLogger.info('Telegram connected');
  }
}
