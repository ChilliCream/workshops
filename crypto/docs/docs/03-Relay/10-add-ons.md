import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Add-ons

## Relay DevTools

You can inspect data in the store of your Relay apps, and how that data changes over time in response to GraphQL queries, and client mutations by adding the extension [Relay Developer Tools](https://chrome.google.com/webstore/detail/relay-developer-tools/ncedobpgnmkhcmnnkcimnobpfepidadl) to the Chrome Developer Tools.

For more information, read the docs [here](https://relay.dev/docs/debugging/relay-devtools/).

## Persisted Queries

The Relay compiler supports persisted queries. This is useful because:

- The client operation text becomes just an md5 hash which is usually shorter than the real query string. This saves upload bytes from the client to the server.

- The server can now whitelist queries which improves security by restricting the operations that can be executed by a client.

You have the possibility to persist the queries:

- **Remote**: using a sever endpoint that will process and identify the queries.

- **Local**: using a local file where the compiler will write a map for the queries.

Take a look to the `Greetings` example and the difference of the compiled output:

<Tabs>
  <TabItem value="non-persisted" label="Non-persisted" default>

```js title="/generated/GreetingsQuery.graphql.js"
/**
 * @generated SignedSource<<13cc28d6173216c5c2051e50cb5b41e1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'name',
      },
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: 'Variable',
            name: 'name',
            variableName: 'name',
          },
        ],
        kind: 'ScalarField',
        name: 'greetings',
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: (v0 /*: any*/),
      kind: 'Fragment',
      metadata: null,
      name: 'GreetingsQuery',
      selections: (v1 /*: any*/),
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: (v0 /*: any*/),
      kind: 'Operation',
      name: 'GreetingsQuery',
      selections: (v1 /*: any*/),
    },
    params: {
      cacheID: 'df17284c16608f10e79c40f215176912',
      id: null,
      metadata: {},
      name: 'GreetingsQuery',
      operationKind: 'query',
      text: 'query GreetingsQuery(\n  $name: String!\n) {\n  greetings(name: $name)\n}\n',
    },
  };
})();

node.hash = '8100c9379a13b8b002da3186b76f05d6';
export default node;
```

  </TabItem>
  <TabItem value="persisted" label="Persisted">

```js title="/generated/GreetingsQuery.graphql.js"
/**
 * @generated SignedSource<<fc6dfc4b6ead64af0e00f1091a2672eb>>
 * @relayHash df17284c16608f10e79c40f215176912
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

// @relayRequestID 38c438dbaa37d7ed988b5a1262576bd4d226d998

var node = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'name',
      },
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: 'Variable',
            name: 'name',
            variableName: 'name',
          },
        ],
        kind: 'ScalarField',
        name: 'greetings',
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: (v0 /*: any*/),
      kind: 'Fragment',
      metadata: null,
      name: 'GreetingsQuery',
      selections: (v1 /*: any*/),
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: (v0 /*: any*/),
      kind: 'Operation',
      name: 'GreetingsQuery',
      selections: (v1 /*: any*/),
    },
    params: {
      id: '38c438dbaa37d7ed988b5a1262576bd4d226d998',
      metadata: {},
      name: 'GreetingsQuery',
      operationKind: 'query',
      text: null,
    },
  };
})();

node.hash = '8100c9379a13b8b002da3186b76f05d6';
export default node;
```

```json title="/persisted.json"
{
  "38c438dbaa37d7ed988b5a1262576bd4d226d998": "query GreetingsQuery(\n  $name: String!\n) {\n  greetings(name: $name)\n}\n"
}
```

  </TabItem>
</Tabs>

For more information, read the docs [here](https://relay.dev/docs/guides/persisted-queries/#executing-persisted-queries-on-the-server) and [here](https://github.com/facebook/relay/tree/main/packages/relay-compiler).

## Type Emission

As part of its normal work, the [Relay Compiler](https://relay.dev/docs/guides/compiler/) will emit type information for your language of choice (i.e. javascript, typescript, flow) that helps you write type-safe application code. These types are included in the artifacts that `relay-compiler` generates to describe your operations and fragments.

Take a look to the `Greetings` example and how we can emit different type information:

<Tabs>
  <TabItem value="javascript" label="Javascript" default>

```js title="/generated/GreetingsQuery.graphql.js"
/**
 * @generated SignedSource<<a2de065d887a05e8af1910bdf9c3b51d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function () {
  var v0 = [
    {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'greetings',
      storageKey: null,
    },
  ];
  return {
    fragment: {
      argumentDefinitions: [],
      kind: 'Fragment',
      metadata: null,
      name: 'GreetingsQuery',
      selections: (v0 /*: any*/),
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: [],
      kind: 'Operation',
      name: 'GreetingsQuery',
      selections: (v0 /*: any*/),
    },
    params: {
      cacheID: 'acbfaea45bca09685fc5691a1903f78a',
      id: null,
      metadata: {},
      name: 'GreetingsQuery',
      operationKind: 'query',
      text: 'query GreetingsQuery {\n  greetings\n}\n',
    },
  };
})();

node.hash = '613f3ef79740dc8be3c71bb5b04d5e2f';
export default node;
```

  </TabItem>
  <TabItem value="typescript" label="Typescript">

```js title="/generated/GreetingsQuery.graphql.ts"
/**
 * @generated SignedSource<<9f91a9c7cb9c50a7ee64374005b6cf3d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import {ConcreteRequest, Query} from 'relay-runtime';
export type GreetingsQuery$variables = {
  name: string;
};
export type GreetingsQuery$data = {
  readonly greetings: string;
};
export type GreetingsQuery = {
  response: GreetingsQuery$data;
  variables: GreetingsQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'name',
      },
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: 'Variable',
            name: 'name',
            variableName: 'name',
          },
        ],
        kind: 'ScalarField',
        name: 'greetings',
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Fragment',
      metadata: null,
      name: 'GreetingsQuery',
      selections: v1 /*: any*/,
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Operation',
      name: 'GreetingsQuery',
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: 'df17284c16608f10e79c40f215176912',
      id: null,
      metadata: {},
      name: 'GreetingsQuery',
      operationKind: 'query',
      text: 'query GreetingsQuery(\n  $name: String!\n) {\n  greetings(name: $name)\n}\n',
    },
  };
})();

(node as any).hash = '8100c9379a13b8b002da3186b76f05d6';

export default node;
```

  </TabItem>
  <TabItem value="flow" label="Flow">

```js title="/generated/GreetingsQuery.graphql.js"
/**
 * @generated SignedSource<<c9e0249d596288f93ce137653e15ede4>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

import type {ConcreteRequest, Query} from 'relay-runtime';
export type GreetingsQuery$variables = {|
  name: string,
|};
export type GreetingsQuery$data = {|
  +greetings: string,
|};
export type GreetingsQuery = {|
  response: GreetingsQuery$data,
  variables: GreetingsQuery$variables,
|};
var node /*: ConcreteRequest */ = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'name',
      },
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: 'Variable',
            name: 'name',
            variableName: 'name',
          },
        ],
        kind: 'ScalarField',
        name: 'greetings',
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: (v0 /*: any */),
      kind: 'Fragment',
      metadata: null,
      name: 'GreetingsQuery',
      selections: (v1 /*: any */),
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: (v0 /*: any */),
      kind: 'Operation',
      name: 'GreetingsQuery',
      selections: (v1 /*: any */),
    },
    params: {
      cacheID: 'df17284c16608f10e79c40f215176912',
      id: null,
      metadata: {},
      name: 'GreetingsQuery',
      operationKind: 'query',
      text: 'query GreetingsQuery(\n  $name: String!\n) {\n  greetings(name: $name)\n}\n',
    },
  };
})();

(node /*: any */).hash = '8100c9379a13b8b002da3186b76f05d6';

export default node;
```

  </TabItem>
</Tabs>

For more information, read the docs [here](https://relay.dev/docs/guides/type-emission/).

## Client Schema Extensions

Relay can be used to read and write local data, and act as a single source of truth for _all_ data in your client application.

Client schema extensions allows you to modify existing types on the schema (e.g. by adding new fields to a type), or to create entirely new types that only exist in the client.

For more information, read the docs [here](https://relay.dev/docs/guides/client-schema-extensions/) and [here](https://relay.dev/docs/guided-tour/updating-data/client-only-data/).

## Testing

Testing applications that are using Relay may be challenging, because of the additional data fetching layer that is wrapping the actual product code.

And it's not always easy to understand the mechanics of all processes that are happening behind Relay, and how to properly handle interactions with the framework.

Fortunately, there are tools that aim to simplify the process of writing tests for Relay components, by providing imperative APIs for controlling the request/response flow and additional API for mock data generation.

There are two main modules that you may using in your tests:

- `createMockEnvironment(options): RelayMockEnvironment`

- `MockPayloadGenerator` and the `@relay_test_operation` directive

The `RelayMockEnvironment` instance created by `createMockEnvironment` has an additional Mock layer, with methods that allow to resolve/reject and control the flow of operations (queries/mutations/subscriptions).

The main purpose of `MockPayloadGenerator` is to improve the process of creating and maintaining the mock data for tested components.

Most of GraphQL type information for a specific field in the selection is not available during Relay runtime. Using the `@relay_test_operation` directive will add additional metadata containing GraphQL type info and it will improve the quality of the generated data.

For example, this test covers the `Greetings` shown before.

```js title="/scenes/Greetings.test.js"
import {act, render, waitFor} from '@testing-library/react';
import {Component, Suspense} from 'react';
import {RelayEnvironmentProvider} from 'react-relay';
import {MockPayloadGenerator, createMockEnvironment} from 'relay-test-utils';

import Greetings from './Greetings';

describe('<Greetings />', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation();

  let environment;
  const name = 'foo';

  class ErrorBoundary extends Component {
    static getDerivedStateFromError(error) {
      return {error};
    }

    state = {error: false};

    render() {
      const {children, fallback} = this.props;
      const {error} = this.state;

      return error ? fallback : children;
    }
  }

  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={environment}>
      <ErrorBoundary fallback="error">
        <Suspense fallback="loading">
          <Greetings name={name} />
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );

  beforeEach(() => {
    environment = createMockEnvironment();
  });

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('should handle loading state', () => {
    const {getByText} = render(<TestRenderer />);

    expect(getByText('loading')).toBeInTheDocument();
  });

  it('should handle data state with automatic mock', async () => {
    const {getByText} = render(<TestRenderer />);

    act(() => {
      environment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation),
      );
    });

    await waitFor(() => {
      expect(
        getByText('<mock-value-for-field-"greetings">'),
      ).toBeInTheDocument();
    });
  });

  it('should handle data state with custom mock', async () => {
    const {getByText} = render(<TestRenderer />);

    act(() => {
      environment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Query() {
            return {
              greetings: `hello, ${name}!`,
            };
          },
        }),
      );
    });

    await waitFor(() => {
      expect(getByText(`hello, ${name}!`)).toBeInTheDocument();
    });
  });

  it('should handle error state', async () => {
    const {getByText} = render(<TestRenderer />);

    act(() => {
      environment.mock.rejectMostRecentOperation(new Error('Uh-oh'));
    });

    await waitFor(() => {
      expect(getByText('error')).toBeInTheDocument();
    });
  });
});
```

:::tip Use the `patch` as a shorthand to reproduce the mentioned changes

```sh
git apply solutions/example1.patch
```

```sh
git apply solutions/example1-test.patch
```

:::

For more information, read the docs [here](https://relay.dev/docs/guides/testing-relay-components/).
