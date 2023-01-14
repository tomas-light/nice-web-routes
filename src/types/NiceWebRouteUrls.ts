export type NiceWebRouteUrls = {
  url: <Search extends Record<string, string>>(searchParams?: Search) => string;
  relativeUrl: () => string;
};

export const NICE_WEB_ROUTE_URLS_KEYS: (keyof NiceWebRouteUrls)[] = [
  'url',
  'relativeUrl',
];
