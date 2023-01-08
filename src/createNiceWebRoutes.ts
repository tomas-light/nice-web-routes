import { ParametrizedNiceWebRoute, NiceWebRoutesNode, NiceWebRouteUrls, NiceWebRoutesDescription } from './types';
import { isNullOrUndefined, snakeCaseToDashCase, UrlBuilder } from './utils';

const reservedNames: (keyof NiceWebRouteUrls)[] = ['url', 'relativeUrl'];

function createNiceWebRoutes<DescriptionShape extends object>(
	niceWebRoutesDescription: NiceWebRoutesDescription<DescriptionShape>,
	previousRoute = '',
	currentSegment = ''
): NiceWebRoutesNode<DescriptionShape, NiceWebRoutesDescription<DescriptionShape>> {
	const niceWebRoutesNode = {} as NiceWebRoutesNode<DescriptionShape, NiceWebRoutesDescription<DescriptionShape>>;

	const dashedCurrentSegment = snakeCaseToDashCase(currentSegment);
	const currentRoute = joinRouteSegments(previousRoute, dashedCurrentSegment);

	for (const [segment, segmentValue] of Object.entries(niceWebRoutesDescription) as [
		keyof typeof niceWebRoutesNode,
		unknown
	][]) {
		if (!segmentValue) {
			continue;
		}
		if (reservedNames.includes(String(segment) as keyof NiceWebRouteUrls)) {
			continue;
		}

		if (typeof segmentValue === 'function') {
			const routesTreeConfig = segmentValue();

			const parametrizedRoute: ParametrizedNiceWebRoute<object> = (value?: string) => {
				let newSegment: string;

				if (isNullOrUndefined(value)) {
					newSegment = `:${String(segment)}`;
				} else {
					newSegment = value;
				}

				return createNiceWebRoutes(routesTreeConfig, currentRoute, newSegment);
			};

			niceWebRoutesNode[segment] = parametrizedRoute as typeof niceWebRoutesNode[typeof segment];

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

	return addUrlMethods(niceWebRoutesNode, previousRoute, dashedCurrentSegment);
}

function addUrlMethods<RouteObject extends {}>(
	routeObject: RouteObject,
	previousRoute: string,
	currentSegment: string
): RouteObject & NiceWebRouteUrls {
	const routeWithUrls = { ...routeObject } as RouteObject & NiceWebRouteUrls;

	routeWithUrls.url = <Search extends Record<string, string>>(searchParams?: Search) => {
		return new UrlBuilder()
			.addPathnameIfExists(joinRouteSegments(previousRoute, snakeCaseToDashCase(currentSegment)))
			.addSearchParamsIfExists(searchParams)
			.build();
	};
	routeWithUrls.relativeUrl = () => currentSegment;

	return routeWithUrls;
}

/** @returns {string} "route/nested-route/another-level" */
function joinRouteSegments(...segments: string[]) {
	const routeSegmentSeparator = '/';
	return segments
		.map((segment) => {
			if (segment.endsWith(routeSegmentSeparator)) {
				return segment.slice(0, segment.length - 2);
			}
			return segment;
		})
		.join(routeSegmentSeparator);
}

export { createNiceWebRoutes, addUrlMethods };
