import { Command } from '../../commands/Command';
import socketIo from 'socket.io';
import { Utils, JSONRPCRequest, JSONRPCError } from 'jayson';

export default function commandWrapper(
  socket: socketIo.Socket,
  command: Command,
): (data: JSONRPCRequest) => void {
  return (data: JSONRPCRequest) => {
    if (data.method === command.getName()) {
      command.getFunction()(data.params)
        .then((result: any) => socket.send(Utils.response(null, result, data.id)))
        .catch((error: JSONRPCError) => socket.send(Utils.response(error, null, data.id)));
    }
  };
}
