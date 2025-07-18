import React from 'react';
import {
  createFrontendPlugin,
  createRouteRef,
  PageBlueprint,
  NavItemBlueprint,
} from '@backstage/frontend-plugin-api';
import { EntityCardBlueprint, EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import CakeIcon from '@material-ui/icons/Cake';
import { Entity } from '@backstage/catalog-model';
import { FormFieldBlueprint } from '@backstage/plugin-scaffolder-react/alpha';

const fooRouteRef = createRouteRef();


export const fooTabExtension = EntityContentBlueprint.make({
  name: 'entity',
  params: {
    defaultPath: 'fooTabPage',
    defaultTitle: 'fooTabPage',
    filter: (entity: Entity) => entity.kind === 'Component',
    loader: () =>
      import('./components/FooTabPage').then(m => (
        <m.FooTabPage />
      )),
  },
});

export const fooCard = EntityCardBlueprint.make({
  name: 'card',
  params: {
    filter: (entity: Entity) => entity.kind === 'Component',
    loader: async () =>
      import('./components/FooCard').then(m => <m.FooCard />
      ),
  },
});

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

const fooField = FormFieldBlueprint.make({
  name: 'catalog-filter',
  params: {
    field: () => import('./fields/FooFieldExtension').then((m) => m.FooField),
  },
});

const fooPlugin: any = createFrontendPlugin({
  id: 'foo',
  extensions: [fooNavItem, fooPage, fooTabExtension, fooCard, fooField],
});


export default fooPlugin;
