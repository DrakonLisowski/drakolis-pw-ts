import { Service } from '../services/eService';
import { ServiceRegistry } from '../services/ServiceRegistry';

export abstract class BaseApplication {

  private registry: ServiceRegistry;

  public abstract getName(): string;
  public abstract getRequiredServices(): Service[];
  public abstract startApplication(): Promise<boolean>;
  public abstract isRunning(): boolean;
  public abstract stop(): Promise<boolean>;

  public getProcessId(): string {
    return process.env.pm_id || '-1';
  }

  public getRegistryLabel(): string {
    return `${this.getName()}:${this.getProcessId()}`;
  }

  public async start(): Promise<boolean> {
    await this.initRegistry();
    await this.startApplication();
    return true;
  }

  protected async initRegistry() {
    this.registry = new ServiceRegistry(this.getRegistryLabel(), this.getRequiredServices());
    return this.registry.prepareRegistryForApplication();
  }

  protected getRegistry(): any {
    return this.registry.registryAsObject();
  }
}
