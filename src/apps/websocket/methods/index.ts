import socketIo from 'socket.io';
import { Utils } from 'jayson';
// tslint:disable-next-line: import-name
import LoggerService from '../../../services/logger';
import isRequestJSONRPC from './middlewares/isRequestJSONRPC';

const parser = (logger: LoggerService, server: socketIo.Server) => {
  server.on('connection', (socket: socketIo.Socket) => {
    // this should be JSONRPC check middleware
    socket.use(isRequestJSONRPC(socket));

    socket.send(Utils.response(null, { message: 'Hello world' }, null));
    socket.on('jsonrpc', (data) => {

    });
  });
};

export default parser;
