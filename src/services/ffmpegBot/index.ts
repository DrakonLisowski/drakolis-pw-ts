import { IService } from '../IService';
import { Service } from '../ServiceDecorator';
import { ServiceInjector } from '../ServiceInjector';
import LoggerService from '../logger';
import Ffmpeg from 'fluent-ffmpeg';

@Service()
export default class FFmpegService implements IService {
  public process: {
    progress: any,
    end: boolean,
    error: any,
  } = { progress: null, end: false, error: null };

  private serviceLogger: LoggerService;
  private running: boolean = false;
  private status: boolean = false; // busy or no
  private ffmpeg: any;

  constructor() {
    this.serviceLogger = ServiceInjector.resolve<LoggerService>(LoggerService)
      .addLabel('FFmpegBot');
    this.init();
  }
  public init() {
    this.serviceLogger.info('start init');
    this.serviceLogger.info(this.isRunning().toString());
    if (!this.isRunning()) {
      this.ffmpeg = Ffmpeg();
      this.ffmpeg
      .on('start', (commandLine: any) => {
        this.serviceLogger.info(commandLine);
      })
      .on('progress', (info: any) => {
        this.serviceLogger.info(JSON.stringify(info));
        this.process.progress = info;
        this.process.end = false;
      })
      .on('end', () => {
        this.serviceLogger.info('process end');
        this.process.end = true;
        this.status = false;
      })
      .on('error', (err: Error) => {
        this.serviceLogger.error(err);
        this.process.end = true;
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
  public getStatus() {
    return this.process;
  }
  public processDone(): boolean {
    if (!this.status) {
      this.process = { progress: null, end: false, error: null };
      return true;
    }
    return false;
  }
  public async run(inFile: string, outFile: string, options: string[]): Promise<boolean> {
    this.serviceLogger.info('start run');
    try {
      if (this.isRunning) {
        if (!this.status) {
          this.status = true;
          const ffmpeg = this.ffmpeg.input(inFile)
          .outputOption(options)
          .output(outFile).run();
        }
      }
    } catch (e) {
      this.serviceLogger.error(e);
    }
    return false;
  }
}
