import { NiceWebRouteUrls } from './NiceWebRouteUrls';

type NiceWebRoutesNode<
  DescriptionShape extends object,
  RoutesDescription = NiceWebRoutesDescription<DescriptionShape>
> = {
  [propertyName in keyof RoutesDescription]: RoutesDescription[propertyName] extends () => infer NestedRoutes
    ? ParametrizedNiceWebRoute<NestedRoutes>
    : NestedNiceWebRoutes<RoutesDescription[propertyName]>;
} & NiceWebRouteUrls;

type ParametrizedNiceWebRoute<NestedRoutes> = (
  value?: string
) => NestedNiceWebRoutes<NestedRoutes>;

type NestedNiceWebRoutes<NestedRouteDescription> =
  NestedRouteDescription extends NiceWebRoutesDescription<
    infer DescriptionShape
  >
    ? NiceWebRoutesNode<DescriptionShape>
    : never;

type ForbiddenNames =
  'This key is reserved. You can not use reserved names as your route segment.';

type FilterReservedNames<RouteSegment> = 'url' extends RouteSegment
  ? ForbiddenNames
  : 'relativeUrl' extends RouteSegment
  ? ForbiddenNames
  : true;

type NiceWebRoutesDescription<DescriptionShape extends object> = {
  [routeSegment in keyof DescriptionShape]: FilterReservedNames<routeSegment> extends ForbiddenNames
    ? ForbiddenNames
    : DescriptionShape[routeSegment] extends infer MaybeObjectOrFunction
    ? NiceWebRoutesDescriptionValue<MaybeObjectOrFunction>
    : DescriptionShape[routeSegment];
};

type NiceWebRoutesDescriptionValue<MaybeObjectOrFunction> =
  MaybeObjectOrFunction extends () => infer FunctionResult
    ? FunctionResult extends object
      ? () => NiceWebRoutesDescription<FunctionResult>
      : 'function description has to return an object'
    : MaybeObjectOrFunction extends object
    ? NiceWebRoutesDescription<MaybeObjectOrFunction>
    : 'route description has to be an object or function';

export type {
  NiceWebRoutesNode,
  ParametrizedNiceWebRoute,
  NestedNiceWebRoutes,
  NiceWebRoutesDescription,
};
