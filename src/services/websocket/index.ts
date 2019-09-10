import http from 'http';
import socketIo from 'socket.io';
import express from 'express';
import { IService } from '../IService';
import { Service } from '../eService';
import config from '../../config';
// tslint:disable-next-line:import-name
import LoggerService from '../logger';

export default class WSService implements IService {

  private socket: socketIo.Server;
  private serviceLogger: LoggerService;
  private isConnected: boolean = false;

  public getDependencies(): Service[] {
    return [Service.Logger];
  }
  public async start(registry: any): Promise<boolean> {
    this.serviceLogger = registry[Service.Logger].addLabel('Socket.IO');

    this.serviceLogger.silly('Starting service...');
    this.socket = socketIo();
    this.serviceLogger.info('Service started, awaiting initialization');
    return true;
  }

  public init(expressInstance: express.Express) {
    this.socket = socketIo(new http.Server(expressInstance));
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

}
