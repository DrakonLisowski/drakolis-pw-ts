import http from 'http';
import socketIo from 'socket.io';
import { IService } from '../IService';
import { Service } from '../ServiceDecorator';
import { ServiceInjector } from '../ServiceInjector';
import LoggerService from '../logger';

@Service()
export default class WSService implements IService {

  private socket: socketIo.Server;
  private serviceLogger: LoggerService;
  private isConnected: boolean = false;

  public async start(): Promise<boolean> {
    this.serviceLogger = ServiceInjector.resolve<LoggerService>(LoggerService)
      .addLabel('Socket.IO');

    this.serviceLogger.silly('Starting service...');
    this.socket = socketIo();
    this.serviceLogger.info('Service started, awaiting initialization');
    return true;
  }

  public init(httpServer: http.Server) {
    this.socket = socketIo(httpServer);
    this.serviceLogger.info('Socket initiated');
    this.isConnected = true;
  }

  public isRunning() {
    return this.isConnected;
  }

  public async stop(): Promise<boolean> {
    this.serviceLogger.info('Stopping service');
    this.isConnected = false;

    return new Promise((res, rej) => {
      this.socket.close(() => {
        this.serviceLogger.info('Service stopped!');
        res(true);
      });
    });
  }

  public getTransport() {
    return this.socket;
  }
}
