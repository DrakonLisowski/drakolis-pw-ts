import { Command } from '../../commands/Command';
import { Method, MethodHandler, JSONRPCErrorLike } from 'jayson';
import { reset } from 'cls-hooked';

export default function commandWrapper(
  command: Command,
) {

  const handler: MethodHandler = (args, callback) => {
    command.getFunction()(args)
      .then((result: any) => callback(null, result))
      .catch((error: JSONRPCErrorLike) => callback(error, reset));
  };

  return {
    [command.getName()]: new Method(handler),
  };
}
