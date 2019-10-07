import { promisify } from 'util';
import { exec } from 'child_process';
import bluebird from 'bluebird';

import { BaseApplication } from '../BaseApplication';
import { ServiceInjector } from '../../services/ServiceInjector';
import LoggerService from '../../services/logger';
import ContextService from '../../services/context';
// @ts-ignore
import NodeMediaServer from 'node-media-server';
import config from '../../config';

const execPromise = promisify(exec);

export default class RTMPServerApplication extends BaseApplication {

  private applicationLogger: LoggerService;

  constructor() {
    super();
    const context = ServiceInjector.resolve<ContextService>(ContextService)
    .addRootContext(this.getLoggingLabel());
    this.applicationLogger = ServiceInjector.resolve<LoggerService>(LoggerService)
      .addLabels(context.getRootContext());
  }

  public getName(): string {
    return 'RTMPServer';
  }

  public async startApplication(): Promise<boolean> {
    const commands = ['ffmpeg -version', 'ffmpeg --version'];

    // First we check that ffmper is installed and good version
    this.applicationLogger.info('Checking ffmpeg\'s version...');
    try {
      await bluebird.any(
        commands.map(async(command) => {
          const { stdout, stderr } = await execPromise(command);
          if (stderr || !/ffmpeg version.*4/.test(stdout)) {
            throw new Error(stderr || stdout);
          }
        }),
      );
    } catch (e) {
      this.applicationLogger.exception('Ffmpeg does not exist or below version 4', e);
      process.exit(1);
    }
    this.applicationLogger.info('Ffmpeg\'s version is good.');

    const nms = new NodeMediaServer({
      rtmp: {
        port: config.rtmpConfig.port,
        chunk_size: config.rtmpConfig.chunkSize,
        gop_cache: config.rtmpConfig.gopCache,
        ping: config.rtmpConfig.ping,
        ping_timeout: config.rtmpConfig.pingTimeout,
      },
      http: {
        port: config.rtmpConfig.httpPort,
        allow_origin: config.rtmpConfig.allowOrigin,
      },
    });
    nms.run();
    return true;
  }

  public isRunning(): boolean {
    return true;
  }

  public async stop(): Promise<boolean> {
    return true;
  }

}

// const NodeMediaServer = require('node-media-server'),
//     config = require('./config/default').rtmp_server;

// nms = new NodeMediaServer(config);

// nms.on('prePublish', async (id, StreamPath, args) => {
//     let stream_key = getStreamKeyFromStreamPath(StreamPath);
//     console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
// });

// const getStreamKeyFromStreamPath = (path) => {
//     let parts = path.split('/');
//     return parts[parts.length - 1];
// };

// module.exports = nms;
