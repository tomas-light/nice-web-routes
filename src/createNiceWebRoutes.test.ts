import { createNiceWebRoutes } from './configureNiceWebRoutesCreating';

const routes = createNiceWebRoutes({
  users: {
    statistic: {},
  },
  article: () => ({}),
  user: {
    userId: () => ({
      avatar: {},
    }),
  },
});

test('if full url on root level equals "/"', () => {
  expect(routes.url()).toBe('/');
});
test('if relative url on root level is empty string', () => {
  expect(routes.relativeUrl()).toBe('');
});
test('if full url on first level equals "/users"', () => {
  expect(routes.users.url()).toBe('/users');
});
test('if relative url on first level equals "/users"', () => {
  expect(routes.users.relativeUrl()).toBe('users');
});
test('if full url on second level equals "/users/statistic"', () => {
  expect(routes.users.statistic.url()).toBe('/users/statistic');
});
test('if relative url on second level equals "statistic"', () => {
  expect(routes.users.statistic.relativeUrl()).toBe('statistic');
});

test('if full url of parametrized route on first level WITHOUT value equals "/:article"', () => {
  expect(routes.article().url()).toBe('/:article');
});
test('if relative url of parametrized route on first level WITHOUT value equals ":article"', () => {
  expect(routes.article().relativeUrl()).toBe(':article');
});
test('if full url of parametrized route on first level WITH value equals "/financial-news"', () => {
  expect(routes.article('financial-news').url()).toBe('/financial-news');
});
test('if relative url of parametrized route on first level WITH value equals "financial-news"', () => {
  expect(routes.article('financial-news').relativeUrl()).toBe('financial-news');
});

test('if full url of parametrized route on second level WITHOUT value equals "/:userId"', () => {
  expect(routes.user.userId().url()).toBe('/user/:userId');
});
test('if relative url of parametrized route on second level WITHOUT value equals ":userId"', () => {
  expect(routes.user.userId().relativeUrl()).toBe(':userId');
});
test('if full url of parametrized route on second level WITH value equals "/home"', () => {
  expect(routes.user.userId('12').url()).toBe('/user/12');
});
test('if relative url of parametrized route on second level WITH value equals "home"', () => {
  expect(routes.user.userId('12').relativeUrl()).toBe('12');
});

describe('using search params in url method', () => {
  test('if single search param is added correctly to the url', () => {
    expect(routes.users.url({ mobile: 'true' })).toBe('/users?mobile=true');
  });
  test('if multiple search param are added correctly to the url', () => {
    expect(
      routes.user.userId('12').url({ avatarSize: '64', about: 'hide' })
    ).toBe('/user/12?avatarSize=64&about=hide');
  });
});
