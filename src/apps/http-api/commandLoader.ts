import commands from '../../commands/httpApiCommands';
import commandWrapper from './commandWrapper';

const loader = () => {
  return commands.reduce((prv, com) => ({ ...prv, ...commandWrapper(com) }), {});
};

export default loader;
