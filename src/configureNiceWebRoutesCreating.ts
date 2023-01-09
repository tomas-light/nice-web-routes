import { defaultSegmentValueGetter } from './defaultSegmentValueGetter';
import { joinRouteSegments } from './joinRouteSegments';
import { makeSearchUrl } from './makeSearchUrl';
import {
  GetSegmentValue,
  NiceWebRoutesDescription,
  NiceWebRoutesNode,
  NiceWebRouteUrls,
  ParametrizedNiceWebRoute,
} from './types';
import {
  DefaultUrlBuilder,
  snakeCaseToDashCase,
  UrlBuilderConstructor,
} from './utils';

const reservedNames: (keyof NiceWebRouteUrls)[] = ['url', 'relativeUrl'];

function configureNiceWebRoutesCreating(config: {
  getSegmentValue?: GetSegmentValue;
  UrlBuilderImpl?: UrlBuilderConstructor;
}) {
  const {
    //
    getSegmentValue = defaultSegmentValueGetter,
    UrlBuilderImpl = DefaultUrlBuilder,
  } = config;

  function createNiceWebRoutes<DescriptionShape extends object>(
    niceWebRoutesDescription: NiceWebRoutesDescription<DescriptionShape>,
    previousRoute = '',
    currentSegment: string | (() => string) = ''
  ): NiceWebRoutesNode<
    DescriptionShape,
    NiceWebRoutesDescription<DescriptionShape>
  > {
    const niceWebRoutesNode = {} as NiceWebRoutesNode<
      DescriptionShape,
      NiceWebRoutesDescription<DescriptionShape>
    >;

    let currentStringSegment: string;
    if (typeof currentSegment === 'function') {
      currentStringSegment = currentSegment();
    } else {
      currentStringSegment = currentSegment;
    }

    const dashedCurrentSegment = snakeCaseToDashCase(currentStringSegment);

    if (typeof niceWebRoutesDescription !== 'object') {
      niceWebRoutesNode.url = makeSearchUrl(
        UrlBuilderImpl,
        previousRoute,
        dashedCurrentSegment
      );
      niceWebRoutesNode.relativeUrl = () => dashedCurrentSegment;
      return niceWebRoutesNode;
    }

    const currentRoute = joinRouteSegments(previousRoute, dashedCurrentSegment);

    for (const [segment, segmentValue] of Object.entries(
      niceWebRoutesDescription
    ) as [keyof typeof niceWebRoutesNode, unknown][]) {
      if (!segmentValue) {
        continue;
      }
      if (reservedNames.includes(String(segment) as keyof NiceWebRouteUrls)) {
        continue;
      }

      if (typeof segmentValue === 'function') {
        const routesTreeConfig = segmentValue();

        const parametrizedRoute: ParametrizedNiceWebRoute<object> = (
          value?: string
        ) => {
          const newSegment = getSegmentValue(String(segment), value);
          return createNiceWebRoutes(
            routesTreeConfig,
            currentRoute,
            newSegment
          );
        };

        niceWebRoutesNode[segment] =
          parametrizedRoute as typeof niceWebRoutesNode[typeof segment];

        continue;
      }

      if (typeof segmentValue === 'object') {
        niceWebRoutesNode[segment] = createNiceWebRoutes(
          segmentValue as NiceWebRoutesDescription<DescriptionShape>,
          currentRoute,
          String(segment)
        ) as typeof niceWebRoutesNode[typeof segment];
      }
    }

    niceWebRoutesNode.url = makeSearchUrl(
      UrlBuilderImpl,
      previousRoute,
      dashedCurrentSegment
    );
    niceWebRoutesNode.relativeUrl = () => dashedCurrentSegment;
    return niceWebRoutesNode;
  }

  return createNiceWebRoutes;
}

export { configureNiceWebRoutesCreating };
