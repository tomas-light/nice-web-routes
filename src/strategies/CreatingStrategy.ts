import { NiceWebRoutesDescription, NiceWebRoutesNode } from '../types';
import { FactoryConfig } from './FactoryConfig';

export type CreatingStrategy = (
  config?: Omit<FactoryConfig, 'creatingStrategy'>
) => <DescriptionShape extends object>(
  niceWebRoutesDescription: NiceWebRoutesDescription<DescriptionShape>,
  parentRoute?: string,
  currentSegmentName?: string
) => NiceWebRoutesNode<
  DescriptionShape,
  NiceWebRoutesDescription<DescriptionShape>
>;
