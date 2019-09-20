import { FfmpegCommand } from 'fluent-ffmpeg';
import { IService } from '../IService';
import { Service } from '../ServiceDecorator';
import { ServiceInjector } from '../ServiceInjector';
import LoggerService from '../logger';

@Service()
export default class FFmpegService implements IService {

  private serviceLogger: LoggerService;
  private running: boolean = false;
  private status: boolean = false; // busy or no
  private ffmpeg: FfmpegCommand;
  private process: {
    progress: any,
    end: boolean,
    error: any,
  };

  constructor() {
    this.serviceLogger = ServiceInjector.resolve<LoggerService>(LoggerService)
      .addLabel('FFmpegBot');
    this.init();
  }
  public init() {
    this.serviceLogger.info('start init');
    this.serviceLogger.info('start init');
    if (!this.isRunning) {
      this.ffmpeg = new FfmpegCommand();
      this.ffmpeg.on('progress', (info) => {
        this.serviceLogger.info(info);
        this.process.progress = info;
      })
      .on('end', () => {
        this.serviceLogger.info('process end');
        this.process.end = false;
        this.status = false;
      })
      .on('error', (err) => {
        this.serviceLogger.error(err);
        this.process.error = err;
        this.status = false;
      });
      this.serviceLogger.info('start completed');
      this.running = true;
    }
  }

  public async start(): Promise<boolean> {
    if (!this.isRunning) {
      await this.init();
    }
    return this.running;
  }
  public isRunning(): boolean {
    return this.running;
  }
  public async stop(): Promise<boolean> {
    if (this.isRunning) {
      await this.ffmpeg.kill('SIGINT');
      this.running = false;
    }
    return true;
  }
  public async run(inFile: string, outFile: string, options: string[]): Promise<boolean> {
    this.serviceLogger.info('start run');
    try {
      if (this.isRunning) {
        if (!this.status) {
          this.status = true;
          this.ffmpeg.input(inFile)
          .outputOption(options)
          .output(outFile);
        }
      }
    } catch (e) {
      this.serviceLogger.error(e);
    }
    return false;
  }
}
