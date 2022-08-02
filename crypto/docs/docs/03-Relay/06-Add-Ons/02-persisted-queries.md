import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Persisted Queries

The Relay compiler supports persisted queries. This is useful because:

- The client operation text becomes just an md5 hash which is usually shorter than the real query string. This saves upload bytes from the client to the server.

- The server can now whitelist queries which improves security by restricting the operations that can be executed by a client.

You’ve the possibility to persist the queries:

- **Remote**: using a sever endpoint that will process and identify the queries.

- **Local**: using a local file where the compiler will write a map for the queries.

Take a look to the `Greetings` example and the difference of the compiled output:

<Tabs>
  <TabItem value="non-persisted" label="Non-persisted" default>

```js title="@/generated/GreetingsQuery.graphql.js"
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

```js title="@/generated/GreetingsQuery.graphql.js"
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

---
