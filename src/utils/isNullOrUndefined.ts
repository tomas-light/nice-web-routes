export function isNullOrUndefined<Value>(value: Value | undefined | null): value is undefined | null {
  return typeof value === 'undefined' || value === null;
}
