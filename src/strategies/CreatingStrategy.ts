import {
  type BaseRouteSetter,
  type NiceWebRoutesDescription,
  type NiceWebRoutesNode,
} from '../types/index.js';
import { type FactoryConfig } from './FactoryConfig.js';

export type CreatingStrategy = (
  config?: Omit<FactoryConfig, 'creatingStrategy'>
) => <DescriptionShape extends object>(
  niceWebRoutesDescription: NiceWebRoutesDescription<DescriptionShape>,
  options?: {
    parentRoute?: string;
    currentSegmentName?: string;
  }
) => NiceWebRoutesNode<
  DescriptionShape,
  NiceWebRoutesDescription<DescriptionShape>
> &
  BaseRouteSetter;
