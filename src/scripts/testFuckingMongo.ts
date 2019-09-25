import { ServiceInjector } from '../services/ServiceInjector';
import { Test } from '../entities/mongo/Test';
import MongoService from '../services/mongo';

const mongoService = ServiceInjector.resolve<MongoService>(MongoService);
mongoService.init().then(() => {
  const test = new Test();
  test.save();
});
