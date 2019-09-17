import socketIo from 'socket.io';
import { Utils } from 'jayson';
import { ERROR } from '../../../util/error';
// tslint:disable-next-line: import-name
import LoggerService from '../../../services/logger';

const parser = (logger: LoggerService, server: socketIo.Server) => {
  server.on('connection', (socket: socketIo.Socket) => {
    // this should be JSONRPC check middleware
    socket.use((packet, next) => {
      const name = packet[0];
      const data = packet[1];
      if (name === 'jsonrpc' && !Utils.Request.isValidRequest(data)) {
        return socket.emit(
          'jsonrpc',
          Utils.response(
            ERROR.INVALID_REQUEST,
            null,
            data.id || null, // May probably lack id
          ),
        );
      }
      return next();
    });

    socket.send(Utils.response(null, { message: 'Hello world' }, null));
    socket.on('jsonrpc', (data) => {
      socket.emit('jsonrpc', Utils.response(null, { data }, null));
    });
  });
};

export default parser;
