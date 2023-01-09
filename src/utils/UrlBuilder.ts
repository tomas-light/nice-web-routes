export interface UrlBuilder {
  addPathnameIfExists(pathname?: string): UrlBuilder;

  addSearchParamsIfExists(searchParams?: Record<string, string>): UrlBuilder;

  build(): string;
}

export interface UrlBuilderConstructor {
  new (): UrlBuilder;
}
