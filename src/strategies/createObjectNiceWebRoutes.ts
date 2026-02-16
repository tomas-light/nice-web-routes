import { defaultSegmentValueGetter } from '../defaultSegmentValueGetter.js';
import {
  type BaseRouteSetter,
  NICE_WEB_ROUTE_URLS_KEYS,
  type NiceWebRoutesDescription,
  type NiceWebRoutesNode,
  type NiceWebRouteUrls,
  type ParametrizedNiceWebRoute,
} from '../types/index.js';
import { DefaultUrlBuilder, snakeCaseToDashCase } from '../utils/index.js';
import { joinRouteSegments } from '../utils/joinRouteSegments.js';
import { type CreatingStrategy } from './CreatingStrategy.js';

type CreatedRoutes<DescriptionShape extends object> = NiceWebRoutesNode<
  DescriptionShape,
  NiceWebRoutesDescription<DescriptionShape>
> &
  BaseRouteSetter;

/**
 * Create nested routes when parametrized routes are called.
 * It is good option, when you have no large trees under parametrized routes.
 * It traverses description tree for objects nodes, and on each parametrized
 * node call (be careful if you have many of this)
 * */
export const createObjectNiceWebRoutes: CreatingStrategy = (config = {}) => {
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
  ): CreatedRoutes<DescriptionShape> {
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

    const node = {
      url: function (
        searchParams: Parameters<CreatedRoutes<DescriptionShape>['url']>[number]
      ) {
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
      setBaseRoute: (
        newBaseRoute: Parameters<
          CreatedRoutes<DescriptionShape>['setBaseRoute']
        >[number]
      ) => {
        options!.parentRoute = newBaseRoute;
      },
    } as CreatedRoutes<DescriptionShape>;

    for (const [descriptionSegment, descriptionSegmentValue] of Object.entries(
      niceWebRoutesDescription
    ) as [keyof typeof node, unknown][]) {
      if (
        typeof descriptionSegment !== 'string' ||
        NICE_WEB_ROUTE_URLS_KEYS.includes(
          descriptionSegment as keyof NiceWebRouteUrls
        )
      ) {
        continue;
      }

      if (typeof descriptionSegmentValue === 'object') {
        let segment: string;
        if (snakeTransformation.disableForSegmentName) {
          segment = descriptionSegment;
        } else {
          segment = snakeCaseToDashCase(descriptionSegment);
        }

        node[descriptionSegment] = createRoutes(
          descriptionSegmentValue as NiceWebRoutesDescription<object>,
          {
            get parentRoute() {
              return joinRouteSegments(
                options!.parentRoute!,
                options!.currentSegmentName!
              );
            },
            currentSegmentName: segment,
          }
        ) as unknown as (typeof node)[typeof descriptionSegment];

        continue;
      }

      if (typeof descriptionSegmentValue === 'function') {
        const parametrizedRoute: ParametrizedNiceWebRoute<any> = (value) => {
          const description = descriptionSegmentValue();

          let segmentValue = getSegmentValue(descriptionSegment, value);
          if (!snakeTransformation.disableForSegmentValue) {
            segmentValue = snakeCaseToDashCase(segmentValue);
          }

          return createObjectNiceWebRoutes(config)(
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

        node[descriptionSegment] =
          parametrizedRoute as unknown as (typeof node)[typeof descriptionSegment];
      }
    }

    return node;
  };
};
