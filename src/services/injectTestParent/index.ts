import { Service } from '../ServiceDecorator';
import { InjectTestDependantService } from '../injectTestDependant';

@Service()
export class InjectTestParentService /* Should extend something here probably */ {

  private id = Date.now();

  constructor(private dependant: InjectTestDependantService) {}

  public log() {
    console.log(`${this.id} ${this.dependant.value}`);
  }
}
