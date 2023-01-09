import { joinRouteSegments } from './joinRouteSegments';
import { snakeCaseToDashCase, UrlBuilderConstructor } from './utils';

function makeSearchUrl(
  urlBuilderConstructor: UrlBuilderConstructor,
  previousRoute: string,
  currentSegment: string
) {
  return function <Search extends Record<string, string>>(
    searchParams?: Search
  ) {
    const routePath = joinRouteSegments(
      previousRoute,
      snakeCaseToDashCase(currentSegment)
    );

    return new urlBuilderConstructor()
      .addPathnameIfExists(routePath)
      .addSearchParamsIfExists(searchParams)
      .build();
  };
}

export { makeSearchUrl };
