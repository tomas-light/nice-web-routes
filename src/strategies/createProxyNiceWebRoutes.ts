import { defaultSegmentValueGetter } from '../defaultSegmentValueGetter';
import {
  type BaseRouteSetter,
  NICE_WEB_ROUTE_URLS_KEYS,
  type NiceWebRoutesDescription,
  type NiceWebRoutesNode,
  type NiceWebRouteUrls,
  type ParametrizedNiceWebRoute,
} from '../types';
import { DefaultUrlBuilder, snakeCaseToDashCase } from '../utils';
import { joinRouteSegments } from '../utils/joinRouteSegments';
import { type CreatingStrategy } from './CreatingStrategy';

type ProxyType = object & NiceWebRouteUrls & BaseRouteSetter;

/**
 * Create proxy for each tree node when that node is accessed.
 * It is good option, if you have large route tree or many nested routes under
 * parametrized routes, because it will not traverse entire tree on each node call.
 * */
export const createProxyNiceWebRoutes: CreatingStrategy = (config = {}) => {
  const {
    getSegmentValue = defaultSegmentValueGetter,
    urlBuilderImpl = DefaultUrlBuilder,
    snakeTransformation = {
      disableForSegmentName: false,
      disableForSegmentValue: false,
    },
  } = config;

  return function createRoutes<DescriptionShape extends object>(
    niceWebRoutesDescription: NiceWebRoutesDescription<DescriptionShape>,
    options?: {
      parentRoute?: string;
      currentSegmentName?: string;
    }
  ): NiceWebRoutesNode<
    DescriptionShape,
    NiceWebRoutesDescription<DescriptionShape>
  > &
    BaseRouteSetter {
    if (!options) {
      options = {
        parentRoute: '',
        currentSegmentName: '',
      };
    }
    if (options.parentRoute == null) {
      options.parentRoute = '';
    }
    if (options.currentSegmentName == null) {
      options.currentSegmentName = '';
    }

    const proxy = new Proxy<ProxyType>(
      {
        url: function (searchParams) {
          const routePath = joinRouteSegments(
            options!.parentRoute!,
            options!.currentSegmentName!
          );

          return new urlBuilderImpl()
            .addPathnameIfExists(routePath)
            .addSearchParamsIfExists(searchParams)
            .build();
        },
        relativeUrl: function (additionalString: string = '') {
          return options!.currentSegmentName! + additionalString;
        },
        setBaseRoute: (newBaseRoute) => {
          options!.parentRoute = newBaseRoute;
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
            return createRoutes(
              segmentDescription as NiceWebRoutesDescription<object>,
              {
                get parentRoute() {
                  return joinRouteSegments(
                    options!.parentRoute!,
                    options!.currentSegmentName!
                  );
                },
                currentSegmentName: segment,
              }
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

              return createRoutes(
                description as NiceWebRoutesDescription<object>,
                {
                  get parentRoute() {
                    return joinRouteSegments(
                      options!.parentRoute!,
                      options!.currentSegmentName!
                    );
                  },
                  currentSegmentName: segmentValue,
                }
              );
            };

            return parametrizedRoute;
          }

          return undefined;
        },
      }
    );

    return proxy as ReturnType<typeof createRoutes<DescriptionShape>>;
  };
};
