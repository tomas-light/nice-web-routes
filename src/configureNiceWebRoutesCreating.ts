import {
  createObjectNiceWebRoutes,
  createProxyNiceWebRoutes,
  type FactoryConfig,
} from './strategies/index.js';

function configureNiceWebRoutesCreating(config: FactoryConfig = {}) {
  switch (config.creatingStrategy) {
    case 'proxy':
      return createProxyNiceWebRoutes(config);

    case 'object':
    default:
      return createObjectNiceWebRoutes(config);
  }
}

export { configureNiceWebRoutesCreating };
