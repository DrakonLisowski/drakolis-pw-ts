import socketIo from 'socket.io';
import { Utils } from 'jayson';
// tslint:disable-next-line: import-name
import LoggerService from '../../services/logger';
import drawAPenis from '../../commands/test/DrawAPenis';
import commandWrapper from './commandWrapper';
import { InvalidRequestError } from '../../errors';

const isRequestJSONRPC = (socket: socketIo.Socket) => {
  return (
    packet: socketIo.Packet,
    next: (err?: any) => void,
  ): any  => {
    const name = packet[0];
    const data = packet[1];
    if (name === 'jsonrpc' && !Utils.Request.isValidRequest(data)) {
      Utils.response(new InvalidRequestError(), null, data.id || null);
    }
    return next();
  };
};

const parser = (logger: LoggerService, server: socketIo.Server) => {
  server.on('connection', (socket: socketIo.Socket) => {
    // this should be JSONRPC check middleware
    socket.use(isRequestJSONRPC(socket));

    socket.send(Utils.response(null, { message: 'Hello world' }, null));

    const methods = [
      commandWrapper(socket, drawAPenis),
    ];

    const methodReduced = methods.reduce(
      (prv, next) => {
        return (data: any) => {
          prv(data);
          next(data);
        };
      },
      // tslint:disable-next-line: no-empty
      (data: any) => {},
    );

    socket.on(
      'message',
      (data: any) => methodReduced(data),
    );

  });
};

export default parser;
