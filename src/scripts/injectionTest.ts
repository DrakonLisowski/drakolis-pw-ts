import 'reflect-metadata';
import { ServiceInjector } from '../services/ServiceInjector';
import { InjectTestParentService } from '../services/injectTestParent';

const test = ServiceInjector.resolve<InjectTestParentService>(InjectTestParentService);
test.log();
