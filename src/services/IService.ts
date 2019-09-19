export interface IService {
  start(registry: any): Promise<boolean>;
  isRunning(): boolean;
  stop(): Promise<boolean>;
}
