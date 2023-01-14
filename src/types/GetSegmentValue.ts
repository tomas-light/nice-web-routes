/**
 * @param {string | symbol | number} segmentName is keyof of NiceWebRoutesDescription
 * @param {string | undefined} segmentValue is passed value into NiceWebRoutesDescription\[segmentName\]()
 * */
export type GetSegmentValue = (
  segmentName: string,
  segmentValue: string | undefined
) => string;
