import http from 'http';
import socketIo, { Server } from 'socket.io';
import { Express } from 'express';
import logger from '../../util/logger';

export default class SocketTransport {

  protected socket: Server = null;

  private transportLogger = logger('Socket');

  public init(expressInstance: Express) {
    this.socket = socketIo(new http.Server(expressInstance));
    this.transportLogger.info('Socket server initiated');
  }
}
