import { GetSegmentValue } from './types';
import { isNullOrUndefined } from './utils';

export const defaultSegmentValueGetter: GetSegmentValue = (
  segmentName,
  segmentValue
) => {
  if (isNullOrUndefined(segmentValue)) {
    return `:${String(segmentName)}`;
  }
  return segmentValue;
};
