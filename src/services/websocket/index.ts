import http from 'http';
import socketIo from 'socket.io';
import { Service } from '../ServiceDecorator';
import ContextService from '../context';
import LoggerService from '../logger';

@Service()
export default class SocketIOService {

  private socket: socketIo.Server;
  private isConnected: boolean = false;

  constructor(
    private context: ContextService,
    private serviceLogger: LoggerService,
  ) {
    this.context.addSubContext(this, null, ['SocketIO']);
    this.serviceLogger = this.serviceLogger.addLabels(this.context.getContext(this));
    this.socket = socketIo();
    this.serviceLogger.info('Service started, awaiting initialization');
  }

  public init(httpServer: http.Server) {
    if (!this.isConnected) {
      this.socket = socketIo(httpServer);
      this.serviceLogger.info('Socket initiated');
      this.isConnected = true;
    }
    return this.socket;
  }
}
