import { IConfig } from './IConfig';
import { ProductionConfig } from './ProductionConfig';
import { DevelopmentConfig } from './DevelopmentConfig';

const config: IConfig =
process.env.NODE_ENV === 'production'
? new ProductionConfig()
: new DevelopmentConfig();

export { IConfig };
export * from './types';
export default config;
