import { defaultSegmentValueGetter } from '../defaultSegmentValueGetter';
import { joinRouteSegments } from '../joinRouteSegments';
import {
  NICE_WEB_ROUTE_URLS_KEYS,
  NiceWebRoutesDescription,
  NiceWebRoutesNode,
  NiceWebRouteUrls,
  ParametrizedNiceWebRoute,
} from '../types';
import { DefaultUrlBuilder, snakeCaseToDashCase } from '../utils';
import { CreatingStrategy } from './CreatingStrategy';

/**
 * Create nested routes when parametrized routes are called.
 * It is good option, when you have no large trees under parametrized routes.
 * It traverses description tree for objects nodes, and on each parametrized
 * node call (be careful if you have many of this)
 * */
export const createObjectNiceWebRoutes: CreatingStrategy = (config = {}) =>
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

    const node = {
      url: function <Search extends Record<string, string>>(
        searchParams?: Search
      ) {
        return new UrlBuilderImpl()
          .addPathnameIfExists(routePath)
          .addSearchParamsIfExists(searchParams)
          .build();
      },
      relativeUrl: function () {
        return currentSegmentName;
      },
    } as NiceWebRoutesNode<
      DescriptionShape,
      NiceWebRoutesDescription<DescriptionShape>
    >;

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
        }
        else {
          segment = snakeCaseToDashCase(descriptionSegment);
        }

        node[descriptionSegment] = createObjectNiceWebRoutes(config)(
          descriptionSegmentValue as NiceWebRoutesDescription<object>,
          routePath,
          segment
        ) as unknown as typeof node[typeof descriptionSegment];

        continue;
      }

      if (typeof descriptionSegmentValue === 'function') {
        const parametrizedRoute: ParametrizedNiceWebRoute<any> = value => {
          const description = descriptionSegmentValue();

          let segmentValue = getSegmentValue(descriptionSegment, value);
          if (!snakeTransformation.disableForSegmentValue) {
            segmentValue = snakeCaseToDashCase(segmentValue);
          }

          return createObjectNiceWebRoutes(config)(
            description as NiceWebRoutesDescription<object>,
            routePath,
            segmentValue
          );
        };

        node[descriptionSegment] =
          parametrizedRoute as unknown as typeof node[typeof descriptionSegment];
      }
    }

    return node;
  };
