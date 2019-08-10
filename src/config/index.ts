import { IConfig } from './IConfig';
import { ProductionConfig } from './ProductionConfig';

const config: IConfig = new ProductionConfig();

export { IConfig };
export * from './types';
export default config;
