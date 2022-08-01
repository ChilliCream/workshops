import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Type Emission

As part of its normal work, the [Relay Compiler](https://relay.dev/docs/guides/compiler/) will emit type information for your language of choice (i.e., javascript, typescript, flow) that helps you write type-safe application code. These types are included in the artifacts that `relay-compiler` generates to describe your operations and fragments.

Take a look to the `Greetings` example and how we can emit different type information:

<Tabs>
  <TabItem value="javascript" label="Javascript" default>

```js title="/generated/GreetingsQuery.graphql.js"
/**
 * @generated SignedSource<<15df7b8fa3fd9ffaa2a9d7c02fcce998>>
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

module.exports = node;
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

import { ConcreteRequest, Query } from 'relay-runtime';
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

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      }
    ],
    "kind": "ScalarField",
    "name": "greetings",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GreetingsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GreetingsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "df17284c16608f10e79c40f215176912",
    "id": null,
    "metadata": {},
    "name": "GreetingsQuery",
    "operationKind": "query",
    "text": "query GreetingsQuery(\n  $name: String!\n) {\n  greetings(name: $name)\n}\n"
  }
};
})();

(node as any).hash = "8100c9379a13b8b002da3186b76f05d6";

export default node;
```

  </TabItem>
  <TabItem value="flow" label="Flow">

```js title="/generated/GreetingsQuery.graphql.js"
/**
 * @generated SignedSource<<c8a3e7085ae35da7c834bf2d0ca866b5>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, Query } from 'relay-runtime';
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
*/

var node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      }
    ],
    "kind": "ScalarField",
    "name": "greetings",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GreetingsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GreetingsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "df17284c16608f10e79c40f215176912",
    "id": null,
    "metadata": {},
    "name": "GreetingsQuery",
    "operationKind": "query",
    "text": "query GreetingsQuery(\n  $name: String!\n) {\n  greetings(name: $name)\n}\n"
  }
};
})();

(node/*: any*/).hash = "8100c9379a13b8b002da3186b76f05d6";

module.exports = ((node/*: any*/)/*: Query<
  GreetingsQuery$variables,
  GreetingsQuery$data,
>*/);
```

  </TabItem>
</Tabs>

For more information, read the docs [here](https://relay.dev/docs/guides/type-emission/).

---
