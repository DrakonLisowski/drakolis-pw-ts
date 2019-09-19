export interface IService {
  start(): Promise<boolean>;
  isRunning(): boolean;
  stop(): Promise<boolean>;
}
