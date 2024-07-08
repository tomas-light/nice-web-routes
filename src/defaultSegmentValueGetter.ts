import { type GetSegmentValue } from './types/index.js';

export const defaultSegmentValueGetter: GetSegmentValue = (
  segmentName,
  segmentValue
) => {
  if (segmentValue == null) {
    return `:${String(segmentName)}`;
  }
  return segmentValue;
};
