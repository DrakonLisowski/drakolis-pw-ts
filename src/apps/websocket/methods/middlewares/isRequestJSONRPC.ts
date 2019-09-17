import socketIo from 'socket.io';
import { ERROR } from '../../../../util/error';
import { Utils } from 'jayson';

export default function isRequestJSONRPC(socket: socketIo.Socket) {
  return (
    packet: socketIo.Packet,
    next: (err?: any) => void,
  ): any  => {
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
  };
}
