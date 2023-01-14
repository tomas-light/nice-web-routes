import { defaultSegmentValueGetter } from '../defaultSegmentValueGetter';
import { joinRouteSegments } from '../utils/joinRouteSegments';
import {
  NICE_WEB_ROUTE_URLS_KEYS,
  NiceWebRoutesDescription,
  NiceWebRoutesNode,
  NiceWebRouteUrls,
  ParametrizedNiceWebRoute,
} from '../types';
import { DefaultUrlBuilder, snakeCaseToDashCase } from '../utils';
import { CreatingStrategy } from './CreatingStrategy';

type ProxyType = object & NiceWebRouteUrls;

/**
 * Create proxy for each tree node when that node is accessed.
 * It is good option, if you have large route tree or many nested routes under
 * parametrized routes, because it will not traverse entire tree on each node call.
 * */
export const createProxyNiceWebRoutes: CreatingStrategy = (config = {}) =>
  function <DescriptionShape extends object>(
    niceWebRoutesDescription: NiceWebRoutesDescription<DescriptionShape>,
    parentRoute: string = '',
    currentSegmentName: string = ''
  ): NiceWebRoutesNode<
    DescriptionShape,
    NiceWebRoutesDescription<DescriptionShape>
  > {
    const {
      getSegmentValue = defaultSegmentValueGetter,
      UrlBuilderImpl = DefaultUrlBuilder,
      snakeTransformation = {
        disableForSegmentName: false,
        disableForSegmentValue: false,
      },
    } = config;

    const routePath = joinRouteSegments(parentRoute, currentSegmentName);

    const proxy = new Proxy<ProxyType>(
      {
        url: function <Search extends Record<string, string>>(
          searchParams?: Search | string
        ) {
          return new UrlBuilderImpl()
            .addPathnameIfExists(routePath)
            .addSearchParamsIfExists(searchParams)
            .build();
        },
        relativeUrl: function (additionalString: string = '') {
          return currentSegmentName + additionalString;
        },
      },
      {
        ownKeys(): ArrayLike<string | symbol> {
          return Object.keys(niceWebRoutesDescription).concat(
            NICE_WEB_ROUTE_URLS_KEYS
          );
        },
        has(instance: ProxyType, propertyName: keyof typeof instance): boolean {
          return (
            propertyName in niceWebRoutesDescription ||
            NICE_WEB_ROUTE_URLS_KEYS.includes(propertyName)
          );
        },
        getOwnPropertyDescriptor() {
          return {
            enumerable: true,
            configurable: true,
          };
        },
        get(instance: ProxyType, propertyName: keyof typeof instance): any {
          if (
            NICE_WEB_ROUTE_URLS_KEYS.includes(
              String(propertyName) as keyof NiceWebRouteUrls
            )
          ) {
            // use "url" or "relativeUrl" of target
            return instance[propertyName];
          }

          const segmentDescription =
            niceWebRoutesDescription[
              propertyName as keyof typeof niceWebRoutesDescription
            ];

          if (typeof segmentDescription === 'object') {
            let segment: string;
            if (snakeTransformation.disableForSegmentName) {
              segment = propertyName;
            } else {
              segment = snakeCaseToDashCase(propertyName);
            }
            return createProxyNiceWebRoutes(config)(
              segmentDescription as NiceWebRoutesDescription<object>,
              routePath,
              segment
            );
          }

          if (typeof segmentDescription === 'function') {
            const parametrizedRoute: ParametrizedNiceWebRoute<any> = (
              value
            ) => {
              const description = segmentDescription();

              let segmentValue = getSegmentValue(propertyName, value);
              if (!snakeTransformation.disableForSegmentValue) {
                segmentValue = snakeCaseToDashCase(segmentValue);
              }

              return createProxyNiceWebRoutes(config)(
                description as NiceWebRoutesDescription<object>,
                routePath,
                segmentValue
              );
            };

            return parametrizedRoute;
          }

          return undefined;
        },
      }
    );

    return proxy as NiceWebRoutesNode<
      DescriptionShape,
      NiceWebRoutesDescription<DescriptionShape>
    >;
  };
