import socketIo from 'socket.io';
import { Utils, JSONRPCRequest, JSONRPCError } from 'jayson';
import { Command } from '../../commands/Command';

export default function commandWrapper(socket: socketIo.Socket, command: Command) {
  const handler = (data: JSONRPCRequest) => {
    command
      .getFunction()(data.params)
      .then((result: any) => socket.send(Utils.response(null, result, data.id)))
      .catch((error: JSONRPCError) => socket.send(Utils.response(error, null, data.id)));
  };
  return {
    [command.getName()]: handler,
  };
}
