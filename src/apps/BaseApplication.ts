export abstract class BaseApplication {

  public abstract getName(): string;
  public abstract startApplication(): Promise<boolean>;
  public abstract isRunning(): boolean;
  public abstract stop(): Promise<boolean>;

  public getProcessId(): string {
    return process.env.pm_id || '-1';
  }

  public getLoggingLabel(): string {
    return `${this.getName()}:${this.getProcessId()}`;
  }

  public async start(): Promise<boolean> {
    await this.startApplication();
    return true;
  }
}
