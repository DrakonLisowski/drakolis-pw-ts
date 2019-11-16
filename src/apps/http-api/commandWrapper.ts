import { Method, MethodHandler, JSONRPCErrorLike } from 'jayson';
import { reset } from 'cls-hooked';
import Command from '../../commands/Command';

export default function commandWrapper(command: Command) {
  const handler: MethodHandler = (args, callback) => {
    command
      .getFunction()(args)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((result: any) => callback(null, result))
      .catch((error: JSONRPCErrorLike) => callback(error, reset));
  };

  return {
    [command.getName()]: new Method(handler),
  };
}
