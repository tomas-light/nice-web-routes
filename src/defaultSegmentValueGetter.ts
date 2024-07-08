import { type GetSegmentValue } from './types';

export const defaultSegmentValueGetter: GetSegmentValue = (
  segmentName,
  segmentValue
) => {
  if (segmentValue == null) {
    return `:${String(segmentName)}`;
  }
  return segmentValue;
};
