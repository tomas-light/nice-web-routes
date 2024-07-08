import type { BaseRouteSetter } from './NiceWebRoutesNode';

export type NiceWebRouteUrls = {
  url: (searchParams?: Record<string, string | string[]> | string) => string;
  relativeUrl: (additionalString?: string) => string;
};

export const NICE_WEB_ROUTE_URLS_KEYS: Array<
  keyof (NiceWebRouteUrls & BaseRouteSetter)
> = ['url', 'relativeUrl', 'setBaseRoute'];
