import { getStringDefaultValueForArgument } from './getStringDefaultValueForArgument';

describe('getDefaultValuesForArguments', () => {
  test('if default value for single function argument is extracted properly', () => {
    function getQuestRouteFn(userId = ':userId') {}

    const defaultValue = getStringDefaultValueForArgument(getQuestRouteFn);
    expect(defaultValue).toBe(':userId');
  });

  test('if default value for single ARROW function argument is extracted properly', () => {
    const getQuestRouteArrowFn = (userId = ':userId') => {};

    const defaultValue = getStringDefaultValueForArgument(getQuestRouteArrowFn);
    expect(defaultValue).toBe(':userId');
  });
});
