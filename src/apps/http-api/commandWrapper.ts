import { Command } from '../../commands/Command';
import { Method, MethodHandler } from 'jayson';
import { reset } from 'cls-hooked';

export default function commandWrapper(
  command: Command,
) {

  const handler: MethodHandler = (args, callback) => {
    command.getFunction()(args)
      .then(result => callback(null, result))
      .catch(error => callback(error, reset));
  };

  return {
    [command.getName()]: new Method(handler),
  };
}
