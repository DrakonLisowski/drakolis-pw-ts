import { Service } from '../ServiceDecorator';
import ContextService from '../context';
import LoggerService from '../logger';

@Service()
export default class FFmpegService {

  constructor(
    private context: ContextService,
    private serviceLogger: LoggerService) {
    this.context.addSubContext(this, null, 'btc bot');
    this.serviceLogger = this.serviceLogger.addLabels(this.context.getContext(this));
    this.init();
  }
  public init() {
    this.serviceLogger.info('Start Init');
  }
}
