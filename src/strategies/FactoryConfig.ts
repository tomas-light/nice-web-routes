import { type GetSegmentValue } from '../types/GetSegmentValue';
import { type UrlBuilderConstructor } from '../utils';
import { type CreatingStrategyVariant } from './creatingStrategies';

export type FactoryConfig = {
  getSegmentValue?: GetSegmentValue;
  urlBuilderImpl?: UrlBuilderConstructor;
  creatingStrategy?: CreatingStrategyVariant;

  snakeTransformation?: {
    disableForSegmentName?: boolean;
    disableForSegmentValue?: boolean;
  };
};
