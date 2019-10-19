import { promisify } from 'util';
import { exec } from 'child_process';
import bluebird from 'bluebird';

import NodeMediaServer from 'node-media-server';
import BaseApplication from '../BaseApplication';
import { ServiceInjector } from '../../services/ServiceInjector';
import LoggerService from '../../services/logger';
import ContextService from '../../services/context';
// @ts-ignore
import config from '../../config';

const execPromise = promisify(exec);

export default class RTMPServerApplication extends BaseApplication {
  private applicationLogger: LoggerService;

  constructor() {
    super();
    const context = ServiceInjector.resolve<ContextService>(ContextService).addRootContext(
      this.getLoggingLabel(),
    );
    this.applicationLogger = ServiceInjector.resolve<LoggerService>(LoggerService).addLabels(
      context.getRootContext(),
    );
  }

  public getName(): string {
    return 'RTMPServer';
  }

  public async startApplication(): Promise<boolean> {
    const commands = ['ffmpeg -version', 'ffmpeg --version'];

    // First we check that ffmper is installed and good version
    this.applicationLogger.info("Checking ffmpeg's version...");
    try {
      await bluebird.any(
        commands.map(async command => {
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
    this.applicationLogger.info("Ffmpeg's version is good.");

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
        mediaroot: config.rtmpConfig.mediaRoot,
      },
      trans: {
        ffmpeg: '/usr/bin/ffmpeg',
        tasks: [
          {
            app: 'live',
            hls: true,
            hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
            dash: true,
            dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
          },
        ],
      },
    });
    await nms.run();
    return true;
  }

  public isRunning(): boolean {
    return true;
  }

  public async stop(): Promise<boolean> {
    return true;
  }
}
