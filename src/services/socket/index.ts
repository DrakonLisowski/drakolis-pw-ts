import http from 'http';
import socketIo, { Server, ServerOptions } from 'socket.io';
import { Express } from 'express';
import { IService } from '../IService';
import logger from '../../util/logger';
import config from '../../config';

export default class WSService implements IService {

  private serviceLogger = logger('Socket');
  private socket: Server = null;
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

  public init(expressInstance: Express) {
    this.socket = socketIo(new http.Server(expressInstance));
    this.serviceLogger.info('Service initiated');
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
