import { GetSegmentValue } from '../types/GetSegmentValue';
import { UrlBuilderConstructor } from '../utils';
import { CreatingStrategyVariant } from './creatingStrategies';

export type FactoryConfig = {
  getSegmentValue?: GetSegmentValue;
  urlBuilderImpl?: UrlBuilderConstructor;
  creatingStrategy?: CreatingStrategyVariant;

  snakeTransformation?: {
    disableForSegmentName?: boolean;
    disableForSegmentValue?: boolean;
  };
};
