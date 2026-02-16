import { describe, expect, test } from 'vitest';
import { joinRouteSegments } from './joinRouteSegments.js';

describe('[function] joinRouteSegments', () => {
  test('if pathname contains a few segments', () => {
    const result = joinRouteSegments('/some-url/with-nested/routes');
    expect(result).toBe('some-url/with-nested/routes');
  });

  test('if concatenation of pathname leads to correct pathname', () => {
    const result = joinRouteSegments('some-url', 'asd');
    expect(result).toBe('some-url/asd');
  });

  test('if concatenation of pathname skips an empty strings', () => {
    const result = joinRouteSegments('/some-url', '', '/routes');
    expect(result).toBe('some-url/routes');
  });

  test('if url can be passed to segment value', () => {
    const result = joinRouteSegments('indicator', 'https://почта.рф/11');
    expect(result).toBe('indicator/https://почта.рф/11');
  });
});
