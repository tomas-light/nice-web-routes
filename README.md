# nice-web-routes

Easy way to create nice web routes for you application

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mui/material-ui/blob/HEAD/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/nice-web-routes/latest.svg)](https://img.shields.io/npm/v/nice-web-routes/latest.svg)
[![codecov](https://codecov.io/github/tomas-light/nice-web-routes/branch/main/graph/badge.svg?token=NuAoioGPVD)](https://codecov.io/github/tomas-light/nice-web-routes)

- [Installation](#install)
- [How to use](#usage)
- [Base route customization](#base-route)
- [Using with react-router](#react-router)
- [Customization](#customization)
  - [FactoryConfig](#config)
  - [Creating strategies](#strategies)

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
    // typed parameter
    form: (form: 'create' | 'edit') => ({}),
  },
});

routes.url(); // '/'
routes.users.url(); // '/users'
routes.users.statistic.url(); // '/users/statistic'
routes.users.statistic.relativeUrl(); // 'statistic'

routes.users.statistic.url({ view: 'print', filter: 'no' }); // '/users/statistic?view=print&filter=no'
routes.users.statistic.url('/*'); // '/users/statistic/*'

routes.user.userId().relativeUrl(); // ':userId'
routes.user.userId('18').private_info.url(); // '/user/18/private-info'

// typed parameter
routes.user.form('create').url(); // '/user/create'
routes.user.form('edit').url(); // '/user/edit'
routes.user.form('something').url(); // error because it violates type constraint of 'create' | 'edit' | undefined
```

### <a name="base-route"></a> Base route customization

Generally you choose to use base route or don't on routes creation time:

```ts
const routes = createObjectNiceWebRoutes({
  home: {},
  welcome: {},
});

routes.home.url(); // "/home"
routes.welcome.url(); // "/welcome"

// with base route

const apiRoutes = createObjectNiceWebRoutes(
  {
    users: {
      userId: () => ({}),
    },
  },
  { parentRoute: '/api/v4' }
);

routes.users.url(); // "/api/v4/users"
routes.users.userId('123').url(); // "/api/v4/users/123"
```

But there are some cases when you need to change base route dynamically,
or for example if your routes are started with locale and after user changes page language,
routes should be changed as well:

```ts
const routes = createObjectNiceWebRoutes(
  {
    home: {},
    welcome: {},
  },
  { parentRoute: '/en' }
);

routes.home.url(); // "/en/home"
routes.welcome.url(); // "/en/welcome"

routes.setBaseRoute('/de');

routes.home.url(); // "/de/home"
routes.welcome.url(); // "/de/welcome"
```

### <a name="react-router"></a> Using with react-router

```tsx
import { createNiceWebRoutes } from 'nice-web-routes';
import { Navigate, Route, Routes } from 'react-router-dom';

const appRoutes = createNiceWebRoutes({
  auth: {
    login: {},
    registration: {},
  },
  profile: {
    userId: () => ({}),
    settings: {},
    edit: {
      personal: {},
      career: {},
    },
  },
});

const App = () => (
  <Routes>
    <Route
      index
      element={<Navigate to={appRoutes.auth.relativeUrl()} replace />}
    />

    <Route path={appRoutes.auth.url('/*')}>
      {' '}
      {/* '/auth/*' */}
      <Route
        index
        element={<Navigate to={appRoutes.auth.login.relativeUrl()} replace />}
      />
      <Route
        path={appRoutes.auth.login.relativeUrl()}
        element={<LoginDisplay />}
      />
      <Route
        path={appRoutes.auth.registration.relativeUrl()}
        element={<RegistrationDisplay />}
      />
    </Route>

    <Route path={appRoutes.profile.url('/*')}>
      {' '}
      {/* '/profile/*' */}
      <Route index element={<MyProfileDisplay />} />
      <Route
        path={appRoutes.profile.userId().relativeUrl()}
        element={<UserProfile />}
      />
      <Route
        path={appRoutes.profile.settings.relativeUrl()}
        element={<SettingsDisplay />}
      />
      <Route path={appRoutes.profile.edit.relativeUrl('/*')}>
        {' '}
        {/* 'edit/*' */}
        <Route index element={<ProfileSettings />} />
        <Route
          path={appRoutes.profile.edit.career.relativeUrl()}
          element={<EditCareerDisplay />}
        />
        <Route
          path={appRoutes.profile.edit.personal.relativeUrl()}
          element={<EditPersonalInformationDisplay />}
        />
      </Route>
    </Route>
  </Routes>
);
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

    // it is how route parameters are created by default
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

| Property              | Type                                                                                      | Description                                                                                           | Default value                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `getSegmentValue`     | `GetSegmentValue` => `(segmentName: string, segmentValue: string or undefined) => string` | It is responsible for displaying parametrized route value                                             | value is displayed as is, and when there is no value it shows as `:segmentName` |
| `urlBuilderImpl`      | `UrlBuilderConstructor` => class that implements `UrlBuilder` interface                   | You can override how the target url is creating                                                       | `DefaultUrlBuilder` - internal implementation                                   |
| `creatingStrategy`    | `CreatingStrategyVariant` => `'proxy'` or `'object'`                                      | it is about how your routes object is created (see [Creating strategies](#strategies) section bellow) | `object`                                                                        |
| `snakeTransformation` | `{ disableForSegmentName?: boolean; disableForSegmentValue?: boolean; }`                  | You can disable transformation of `user_list` segment name or value to `user-list` url part           | `{}`                                                                            |

#### <a name="strategies"></a> Creating strategies

<b>Object</b> strategy creates nested routes only when parametrized route is called.

It is good option, when you have no large trees under parametrized routes, because it traverses description tree for each parametrized node call . Objects nodes are traversed during routes creation time until it reaches parametrized route.

<b>Proxy</b> strategy creates proxy for each tree node when that node is accessed.

It is good option, if you have large route tree or many nested routes under parametrized routes, because it will not traverse entire tree on each node call. But performance in such case is lower than in Object strategy (caused Proxy implementation in js core).
