export interface IService {
  getDependencies(): string[];
  startService(registry: any): Promise<boolean>;
  isRunning(): boolean;
  stopService(): Promise<boolean>;
}
