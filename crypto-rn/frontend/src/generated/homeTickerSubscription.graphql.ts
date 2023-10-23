/**
 * @generated SignedSource<<c4218a2ac10e9406ff048e51c3489ab2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeTickerSubscription$variables = {
  symbols?: ReadonlyArray<string> | null;
};
export type homeTickerSubscription$data = {
  readonly onPriceChange: {
    readonly " $fragmentSpreads": FragmentRefs<"homeTickerItemFragment_assetprice">;
  };
};
export type homeTickerSubscription = {
  response: homeTickerSubscription$data;
  variables: homeTickerSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "symbols"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "symbols",
    "variableName": "symbols"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "homeTickerSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AssetPrice",
        "kind": "LinkedField",
        "name": "onPriceChange",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "homeTickerItemFragment_assetprice"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "homeTickerSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AssetPrice",
        "kind": "LinkedField",
        "name": "onPriceChange",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "currency",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "lastPrice",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "change24Hour",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "11d7f8b8a009e71d7e4e7955f6f0155f",
    "id": null,
    "metadata": {},
    "name": "homeTickerSubscription",
    "operationKind": "subscription",
    "text": "subscription homeTickerSubscription(\n  $symbols: [String!]\n) {\n  onPriceChange(symbols: $symbols) {\n    ...homeTickerItemFragment_assetprice\n    id\n  }\n}\n\nfragment homeTickerItemFragment_assetprice on AssetPrice {\n  currency\n  lastPrice\n  change24Hour\n}\n"
  }
};
})();

(node as any).hash = "ddd7447cbdb789bd07a9dacdd6ff2675";

export default node;
