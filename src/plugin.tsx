import React from 'react';
import {
  createFrontendPlugin,
  createRouteRef,
  PageBlueprint,
  NavItemBlueprint,
} from '@backstage/frontend-plugin-api';
import CakeIcon from '@material-ui/icons/Cake';

const fooRouteRef = createRouteRef();

const fooPage = PageBlueprint.make({
  params: {
    routeRef: fooRouteRef,
    defaultPath: '/foo',
    loader: () =>
      import('./components/FooPage').then(({ FooPage }) => <FooPage />),
  },
});

export const fooNavItem = NavItemBlueprint.make({
  params: {
    title: 'Foo',
    icon: CakeIcon,
    routeRef: fooRouteRef,
  },
});

export default createFrontendPlugin({
  id: 'foo',
  extensions: [fooNavItem, fooPage],
});
