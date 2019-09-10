import { Service } from './eService';

export interface IService {
  getDependencies(): Service[];
  start(registry: any): Promise<boolean>;
  isRunning(): boolean;
  stop(): Promise<boolean>;
}
