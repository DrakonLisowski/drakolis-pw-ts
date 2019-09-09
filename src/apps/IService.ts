import { IDrakolisLogger } from '../util/logger';

export interface IService {
  getDependencies(): string[];
  startService(logger: IDrakolisLogger, registry: any): Promise<boolean>;
  isRunning(): boolean;
  stopService(): Promise<boolean>;
}
