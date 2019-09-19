import { Service } from '../ServiceDecorator';

@Service()
export class InjectTestDependantService /* Should extend something here probably */ {
  public value = `Hello world! ${Date.now()}`;
}
