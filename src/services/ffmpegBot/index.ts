import Ffmpeg from 'fluent-ffmpeg';
import { Service } from '../ServiceDecorator';
import ContextService from '../context';
import LoggerService from '../logger';

@Service()
export default class FFmpegService {
  public process: {
    progress: any;
    end: boolean;
    error: any;
  } = { progress: null, end: false, error: null };

  private running: boolean = false;

  private status: boolean = false;

  // busy or no
  private ffmpeg: any;

  constructor(private context: ContextService, private serviceLogger: LoggerService) {
    this.context.addSubContext(this, null, 'Ffmpeg');
    this.serviceLogger = this.serviceLogger.addLabels(this.context.getContext(this));
    this.init();
  }

  public init() {
    this.serviceLogger.info('Start Init');
    this.serviceLogger.info(`Status ffmpeg: ${this.isRunning().toString()}`);
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
          this.serviceLogger.info('Process End');
          this.process.end = true;
          this.status = false;
        })
        .on('error', (err: Error) => {
          this.serviceLogger.error(err);
          this.process.end = true;
          this.process.error = err;
          this.status = false;
        });
      this.serviceLogger.info('Start Completed');
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
          const ffmpeg = this.ffmpeg
            .input(inFile)
            .outputOption(options)
            .output(outFile)
            .run();
        }
      }
    } catch (e) {
      this.serviceLogger.error(e);
    }
    return false;
  }
}
