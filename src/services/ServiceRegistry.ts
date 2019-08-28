import logger from '../util/logger';
import { readdirSync, lstatSync } from 'fs';
import { fork } from 'child_process';
import path from 'path';
import bluebird from 'bluebird';
import { IService } from './IService';
import { DependancyGraph } from './DependancyGraph';
import config from '../config';

type ImportedServicesEntry = [string, any];
export type ServiceRegistryEntry = [string, IService];

export class ServiceRegistry {
  public serviceFolders: string[] = [];

  private serviceRegistry: ServiceRegistryEntry[] = [];
  constructor(
    private servicesPath: string = './src/services',
  ) {
    const dir = readdirSync(this.servicesPath);
    dir.forEach((item) => {
      if (lstatSync(path.join(this.servicesPath, item)).isDirectory()) {
        logger('Service Registry').silly(`Found service: ${item}`);
        this.serviceFolders.push(item);
      }
    });
  }

  public async startServices() {
    try {
    // Trying to import all possible services
      const importedServices = await this.importServices();

    // Trying to create all possible services
      this.serviceRegistry = await this.initRegistry(importedServices);

    // Trying to start all possible services
      const dependecyGraph: DependancyGraph = new DependancyGraph(this.serviceRegistry);
      dependecyGraph.findErrors();

      logger('Service Registry')
      .silly(`Built dependancy graph: ${JSON.stringify(dependecyGraph)}`);

      let roots = [];
      do {
        roots = dependecyGraph.getRoots();
        logger('Service Registry').silly(`Found roots: ${JSON.stringify(roots)}`);
        await bluebird.map( // If there are no more roots than we do nothing here
          roots,
          async (root) => {
            const serv = this.serviceRegistry.find(e => e[0] === root)[1];
            await serv.startService(this.registryAsObject());
            dependecyGraph.removeVertex(root);
          },
          {
            concurrency: config.serviceRegistry.startingConcurrency,
          },
        );
      } while (roots.length !== 0);
      logger('Service Registry').info('Loading finished!');
    } catch (e) {
      logger('Service Registry').error(e.stack);
    }
  }

  public stopServices() {
    return false;
  }

  private async importServices(): Promise<ImportedServicesEntry[]> {
    return bluebird.map(
      this.serviceFolders,
      async (dir) => {
        try {
          const imported = (await import(`./${dir}`)).default;
          return [dir, imported] as ImportedServicesEntry;
        } catch (e) {
          throw new Error(`Unable to import service class: ${dir}, ${e.message}`);
        }
      },
    );
  }

  private async initRegistry(importedServices: ImportedServicesEntry[])
    : Promise<ServiceRegistryEntry[]> {
    return importedServices.reduce(
      (reg, srv) => {
        try {
          return [
            ...reg,
            [srv[0], new srv[1]() as IService] as ServiceRegistryEntry,
          ];
        } catch (e) {
          throw new Error(`Unable to create service instance: ${srv[0]}, ${e.message}`);
        }
      },
      this.serviceRegistry,
    );
  }

  private registryAsObject() {
    return this.serviceRegistry.reduce(
      (obj: any, ent) => {
        obj[ent[0]] = ent[1];
        return obj;
      },
      {},
    );
  }
}
