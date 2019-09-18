import { Command } from '../Command';
import { AlwaysFailError } from '../../errors';

export default new Command(
  'drawAPenis',
  async () => {
    throw new AlwaysFailError();
  },
  true,
  true,
  true,
);
