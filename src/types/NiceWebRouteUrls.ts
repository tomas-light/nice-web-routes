export type NiceWebRouteUrls = {
	url: <Search extends Record<string, string>>(searchParams?: Search) => string;
	relativeUrl: () => string;
};
