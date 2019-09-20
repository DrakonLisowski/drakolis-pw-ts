import 'reflect-metadata';
import { ServiceInjector } from '../services/ServiceInjector';
import { LoaderService } from '../services/LoaderService';

const srv = ServiceInjector.resolve<LoaderService<boolean>>(LoaderService);
srv.init.then(() => srv.init);
