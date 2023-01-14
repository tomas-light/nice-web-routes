import { createObjectNiceWebRoutes } from './createObjectNiceWebRoutes';
import { createProxyNiceWebRoutes } from './createProxyNiceWebRoutes';

export const creatingStrategies = {
  object: createObjectNiceWebRoutes,
  proxy: createProxyNiceWebRoutes,
};

export type CreatingStrategyVariant = keyof typeof creatingStrategies;
