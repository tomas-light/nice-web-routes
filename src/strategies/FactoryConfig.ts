import { type GetSegmentValue } from '../types/GetSegmentValue.js';
import { type UrlBuilderConstructor } from '../utils/index.js';
import { type CreatingStrategyVariant } from './creatingStrategies.js';

export type FactoryConfig = {
  getSegmentValue?: GetSegmentValue;
  urlBuilderImpl?: UrlBuilderConstructor;
  creatingStrategy?: CreatingStrategyVariant;

  snakeTransformation?: {
    disableForSegmentName?: boolean;
    disableForSegmentValue?: boolean;
  };
};
