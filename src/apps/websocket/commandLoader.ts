import socketIo from 'socket.io';
import { Utils } from 'jayson';
// tslint:disable-next-line: import-name
import LoggerService from '../../services/logger';
import drawAPenis from '../../commands/test/DrawAPenis';
import alwaysFail from '../../commands/test/AlwaysFail';
import commandWrapper from './commandWrapper';
import { InvalidRequestError, MethodNotFoundError } from '../../errors';

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

    const methods = {
      ...commandWrapper(socket, drawAPenis),
      ...commandWrapper(socket, alwaysFail),
    };

    socket.on(
      'message',
      (data: any) => {
        const commands = Object.keys(methods);
        if (commands.includes(data.method)) {
          methods[data.method](data);
        }
        socket.send(Utils.response(new MethodNotFoundError(), null, data.id || null));
      },
    );

  });
};

export default parser;
