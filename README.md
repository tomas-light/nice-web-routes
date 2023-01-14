* [Installation](#install)
* [How to use](#usage)
* [Customization](#customization)
  * [FactoryConfig](#config)
  * [Creating strategies](#strategies)

### <a name="install"></a> Installation

```bash
npm install nice-web-routes
```

### <a name="usage"></a> How to use

```ts
import { createNiceWebRoutes } from 'nice-web-routes';

const routes = createNiceWebRoutes({
  users: {
    statistic: {},
  },
  user: {
    userId: () => ({
      avatar: {},
      private_info: {},
    }),
  },
});

routes.url(); // '/'
routes.users.url(); // '/users'
routes.users.statistic.url(); // '/users/statistic'
routes.users.statistic.relativeUrl(); // 'statistic'

routes.user.userId().relativeUrl(); // ':userId'
routes.user.userId('18').private_info.url(); // '/user/18/private-info'
```

### <a name="customization"></a> Customization

You can customize routes creating by using `configureNiceWebRoutesCreating` and passing `FactoryConfig`:

```ts
import { configureNiceWebRoutesCreating } from 'nice-web-routes';

const routes = configureNiceWebRoutesCreating({
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
})({
  user: {
    group: () => ({}),
    userId: () => ({
      avatar: {},
    }),
  },
});

routes.user.group().url(); // '/user/:group'
routes.user.userId().url(); // '/user/:id'
routes.user.userId('18').url(); // '/user/argument_18'
```

#### <a name="config"></a> FactoryConfig

| Property  | Type                                                                                          | Description                                                                                | Default value                                                                   |
|-----------|-----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| `getSegmentValue` | `GetSegmentValue` => `(segmentName: string, segmentValue: string &#124; undefined) => string` | It is responsible for displaying parametrized route value                                  | value is displayed as is, and when there is no value it shows as `:segmentName` |
| `UrlBuilderImpl` | `UrlBuilderConstructor` => class that implements `UrlBuilder` interface                       | You can override how the target url is creating                                            | `DefaultUrlBuilder` - internal implementation                                   |
|  `creatingStrategy`                | `CreatingStrategyVariant` => `'proxy' &#124; 'object'`                                                                                  | it is about how your routes object is created (see [Creating strategies](#strategies) section bellow) | `object`                                                                        |
|  `snakeTransformation`                                  |  `{ disableForSegmentName?: boolean; disableForSegmentValue?: boolean; }`                                                                                            | You can disable transformation of `user_list` segment name or value to `user-list` url part | `{}`              |


#### <a name="strategies"></a> Creating strategies

<b>Object</b> strategy creates nested routes only when parametrized route is called. 

It is good option, when you have no large trees under parametrized routes, because it traverses description tree for each parametrized node call . Objects nodes are traversed during routes creation time until it reaches parametrized route. 

<b>Proxy</b> strategy creates proxy for each tree node when that node is accessed. 

It is good option, if you have large route tree or many nested routes under parametrized routes, because it will not traverse entire tree on each node call. But performance in such case is lower than in Object strategy (caused Proxy implementation in js core).
