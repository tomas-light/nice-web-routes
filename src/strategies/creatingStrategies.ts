import { createObjectNiceWebRoutes } from './createObjectNiceWebRoutes.js';
import { createProxyNiceWebRoutes } from './createProxyNiceWebRoutes.js';

export const creatingStrategies = {
  object: createObjectNiceWebRoutes,
  proxy: createProxyNiceWebRoutes,
};

export type CreatingStrategyVariant = keyof typeof creatingStrategies;
