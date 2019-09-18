import drawAPenis from '../../commands/test/DrawAPenis';
import commandWrapper from './commandWrapper';

const loader = () => {
  return {
    ...commandWrapper(drawAPenis),
  };
};

export default loader;
