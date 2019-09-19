import { Service } from '../ServiceDecorator';
import { InjectTestDependantService } from '../injectTestDependant';

@Service()
export class InjectTestParentService /* Should extend something here probably */ {

  constructor(private dependant: InjectTestDependantService) {}

  public log() {
    console.log(this.dependant.value);
  }
}
