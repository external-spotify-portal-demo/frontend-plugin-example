import * as React from 'react';
import { configApiRef, useApi } from '@backstage/frontend-plugin-api';
import { Content, Header, Page } from '@backstage/core-components';

export const FooTabPage = () => {
  const configApi = useApi(configApiRef);

  const greeting =
    configApi.getOptionalString('foo.greeting') ?? 'Welcome to the foo plugin!';

  return (
    <Page themeId="home">
      <Header style={{ paddingRight: 8 }} title={greeting} />
      <Content>Foo</Content>
    </Page>
  );
};
