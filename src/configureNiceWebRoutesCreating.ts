import {
  createObjectNiceWebRoutes,
  createProxyNiceWebRoutes,
  FactoryConfig,
} from './strategies';

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
