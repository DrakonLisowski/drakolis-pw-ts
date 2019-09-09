import { IService } from './IService';
import { ServiceRegistryEntry } from './ServiceRegistry';

type GraphVertex = [string, string[]];

export class DependancyGraph {
  private structure: GraphVertex[] = [];
  constructor(serviceRegistry: ServiceRegistryEntry[]) {
    serviceRegistry.forEach(srv => this.addVertex(srv[0], srv[1].getDependencies()));
  }

  public findErrors() {
    const allVertices = this.structure.map(v => v[0]);
    this.structure.forEach((v) => {
      v[1].forEach((d) => {
        if (!allVertices.includes(d)) {
          throw new Error(`Service ${v[0]} has unknown dependency ${d}`);
        }
      });
    });
  }

  public addVertex(name: string, connections: string[]) {
    if (connections.includes(name)) {
      // CyclicGraphException
      throw new Error(`Service ${name} depends on itself`);
    }
    this.structure = [...this.structure, [name, connections]];
  }

  public removeVertex(name: string) {
    this.structure = this.structure.filter(v => v[0] !== name);
    this.structure = this.structure.map(v => [v[0], v[1].filter(c => c !== name)] as GraphVertex);
  }

  public getRoots(): string[] {
    const allRoots = this.structure.filter(v => v[1].length === 0);
    if (this.structure.length !== 0 && allRoots.length < 1) {
      // CyclicGraphException
      throw new Error('There seems to be a cyclic dependency');
    }
    return allRoots.map(v => v[0]);
  }

}
