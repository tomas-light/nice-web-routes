import { NICE_WEB_ROUTE_URLS_KEYS } from '../types';
import {
  creatingStrategies,
  CreatingStrategyVariant,
} from './creatingStrategies';

const testTable = Array.from(
  Object.keys(creatingStrategies).map((strategyName) => [
    strategyName as CreatingStrategyVariant,
  ])
);

describe.each(testTable)('%s creating strategy', (strategyName) => {
  const strategy = creatingStrategies[strategyName];

  const description = {
    users: {
      statistic: {},
    },
    article: () => ({}),
    user: {
      userId: () => ({
        avatar: {},
        private_info: {},
      }),
    },
  };

  const routes = strategy()(description);

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
    expect(routes.article('financial-news').relativeUrl()).toBe(
      'financial-news'
    );
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
  describe('if parametrized route has its own value for each call', () => {
    const call1 = routes.user.userId();
    const call2 = routes.user.userId('12');

    test('first call "url" should return ":userId"', () => {
      expect(call1.url()).toBe('/user/:userId');
    });
    test('second call "url" should return "12"', () => {
      expect(call2.url()).toBe('/user/12');
    });

    test('first call "relativeUrl" should return ":userId"', () => {
      expect(call1.relativeUrl()).toBe(':userId');
    });
    test('second call "relativeUrl" should return "12"', () => {
      expect(call2.relativeUrl()).toBe('12');
    });
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

  describe('if snakeTransformation override works', () => {
    test('for name', () => {
      const routes = strategy({
        snakeTransformation: {
          disableForSegmentName: true,
        },
      })(description);

      expect(routes.user.userId().private_info.url()).toBe(
        '/user/:userId/private_info'
      );
    });

    describe('for values', () => {
      const routes = strategy({
        getSegmentValue: (segmentName, segmentValue) => {
          if (typeof segmentValue === 'string') {
            return `argument_${segmentValue}`;
          }

          if (segmentName.toLowerCase().includes('id')) {
            return ':id';
          }
          return `:${segmentName}`;
        },
        snakeTransformation: {
          disableForSegmentValue: true,
        },
      })(description);

      test('if default parameter is not overridden because of condition', () => {
        expect(routes.article().url()).toBe('/:article');
      });
      test('if default parameter is overridden', () => {
        expect(routes.user.userId().avatar.url()).toBe('/user/:id/avatar');
      });
      test('if passed parameter is overridden', () => {
        expect(routes.user.userId('18').avatar.url()).toBe(
          '/user/argument_18/avatar'
        );
      });
    });
  });

  test('If routes keys can be accessed via Object.keys', () => {
    const keys = Object.keys(routes);
    const descriptionKeys = Object.keys(description);
    const urlKeys = NICE_WEB_ROUTE_URLS_KEYS.length;
    expect(keys.length).toBe(descriptionKeys.length + urlKeys);
  });
});
