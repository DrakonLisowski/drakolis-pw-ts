export default abstract class BaseApplication {
  public abstract getName(): string;

  public abstract startApplication(): Promise<boolean>;

  public abstract isRunning(): boolean;

  public abstract stop(): Promise<boolean>;

  public getProcessId(): number {
    return parseInt(process.env.pm_id, 10) || -1;
  }

  public getLoggingLabel(): string {
    return `${this.getName()}:${this.getProcessId()}`;
  }

  public getProcessName(): string {
    return `${this.getName().toLowerCase()}`;
  }

  public async start(): Promise<boolean> {
    await this.startApplication();
    return true;
  }
}
