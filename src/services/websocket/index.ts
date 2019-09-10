import socketIo from 'socket.io';
import { IService } from '../../services/IService';
import SocketTransport from './SocketTransport';
import logger from '../logger/logger';
import config from '../../config';

export default class WSService extends SocketTransport implements IService {

  private serviceLogger = logger('Socket');
  private isConnected: boolean = false;

  public getDependencies(): string[] {
    return [];
  }
  public async startService(registry: any): Promise<boolean> {
    this.serviceLogger.silly('Starting service...');
    this.socket = socketIo();
    this.isConnected = true;
    this.serviceLogger.info('Service started, awaiting initialization');
    return true;
  }

  public isRunning() {
    return this.isConnected;
  }

  public async stopService(): Promise<boolean> {
    this.serviceLogger.info('Stopping service');
    this.isConnected = false;

    return new Promise((res, rej) => {
      this.socket.close(() => {
        this.serviceLogger.info('Service stopped!');
        res(true);
      });
    });
  }

}
