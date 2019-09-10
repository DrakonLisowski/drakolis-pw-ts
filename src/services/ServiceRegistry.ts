import bluebird from 'bluebird';
import lodash from 'lodash';
import { IService } from './IService';
import { Service } from './eService';
import config from '../config';
import RejectPromiseTimeout from '../util/RejectPromiseTimeout';
import { DependancyGraph } from './DependancyGraph';

type ServiceRegistryEntry = [Service, IService];

class ServiceRegistry {

  private serviceMap: ServiceRegistryEntry[];

  constructor(
    private label: string,
    private requiredServices: Service[],
  ) {
  }

  public getLoadedServices(): Service[] {
    return this.serviceMap.map(s => s[0]);
  }

  public async loadServices() {
    this.serviceMap = await this.loadServicesFromList(this.requiredServices);

    let serviceDependencies: Service[] = [];
    let shouldContinue = true;
    do {
      serviceDependencies = await bluebird.reduce(
        this.serviceMap,
        (all, cur) => [...all, ...cur[1].getDependencies()],
        [],
      );
      serviceDependencies = lodash.uniq(serviceDependencies);
      serviceDependencies = lodash.difference(
        serviceDependencies,
        this.getLoadedServices(),
      ); // Removing required services so we dont load them twice

      shouldContinue = serviceDependencies.length > 0;
      if (shouldContinue) {
        this.serviceMap = [
          ...this.serviceMap,
          ...await this.loadServicesFromList(serviceDependencies),
        ];
      }
    } while (shouldContinue);
  }

  public async startServices() {
    const dependecyGraph: DependancyGraph = new DependancyGraph(this.serviceMap);
    dependecyGraph.findErrors();
    let roots = [];
    do {
      roots = dependecyGraph.getRoots();
      await bluebird.map( // If there are no more roots than we do nothing here
        roots,
        async (root) => {
          const serv = this.serviceMap.find(e => e[0] === root)[1];
          await Promise.race([
            serv.start(this.registryAsObject()),
            RejectPromiseTimeout(
              config.serviceRegistry.startingTimeout,
              `Loading timeout for ${root}`,
            ),
          ]);
          dependecyGraph.removeVertex(root);
        },
        {
          concurrency: config.serviceRegistry.startingConcurrency,
        },
      );
    } while (roots.length !== 0);
  }

  public async prepareRegistryForApplication() {
    await this.loadServices();
    await this.startServices();
  }

  public registryAsObject() {
    return this.serviceMap.reduce(
      (reg, srv) => {
        return {
          ...reg,
          [srv[0]]: srv[1],
        };
      },
      {});
  }

  private async loadServicesFromList(services: Service[]) {
    return bluebird.map(
      services,
      async (name) => {
        const instance = await this.loadService(name);
        return [name, instance] as ServiceRegistryEntry;
      },
    );
  }

  private async loadService (service: Service): Promise<IService> {
    switch (service) {
      case Service.Logger:
        return new (await import('./logger')).default(this.label);
      case Service.Postgress:
        return new (await import('./postgress')).default();
      case Service.Redis:
        break;
      case Service.Websocket:
        return new (await import('./websocket')).default();
      default:
        throw new Error(`Unknown service ${service}`);
    }
  }
}

export {
  ServiceRegistry,
  ServiceRegistryEntry,
};
