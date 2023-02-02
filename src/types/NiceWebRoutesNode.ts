import { NiceWebRouteUrls } from './NiceWebRouteUrls';

type NiceWebRoutesNode<
  DescriptionShape extends object,
  RoutesDescription = NiceWebRoutesDescription<DescriptionShape>
> = {
  [propertyName in keyof RoutesDescription]: RoutesDescription[propertyName] extends () => infer NestedRoutes
    ? ParametrizedNiceWebRoute<NestedRoutes>
    : RoutesDescription[propertyName] extends (parameter: infer Parameter) => infer NestedRoutes
      ? ParametrizedNiceWebRoute<NestedRoutes, Parameter>
      : NestedNiceWebRoutes<RoutesDescription[propertyName]>;
} & NiceWebRouteUrls;

type ParametrizedNiceWebRoute<NestedRoutes, Parameter = string> = (
  parameter?: Parameter
) => NestedNiceWebRoutes<NestedRoutes>;

type NestedNiceWebRoutes<NestedRouteDescription> =
  NestedRouteDescription extends NiceWebRoutesDescription<infer DescriptionShape>
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
  MaybeObjectOrFunction extends (...parameter: infer Parameter) => infer FunctionResult
    ? FunctionResult extends object
      ? Parameter[0] extends string
        ? (...parameter: Parameter) => NiceWebRoutesDescription<FunctionResult>

        : Parameter[0] extends undefined
          ? () => NiceWebRoutesDescription<FunctionResult>
          : 'parametrized argument has to be a string'

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
