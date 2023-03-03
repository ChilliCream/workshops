/**
 * @generated SignedSource<<15d480e03d77f648b472dbaf069ba968>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
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
    "name": "WatchlistListSubscription",
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
            "name": "WatchlistListItemFragment_assetprice"
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
    "name": "WatchlistListSubscription",
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
            "name": "marketCap",
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
    "cacheID": "1e1cb0f7d1fe3f2aeeef3eed942e6d5e",
    "id": null,
    "metadata": {},
    "name": "WatchlistListSubscription",
    "operationKind": "subscription",
    "text": "subscription WatchlistListSubscription(\n  $symbols: [String!]\n) {\n  onPriceChange(symbols: $symbols) {\n    ...WatchlistListItemFragment_assetprice\n    id\n  }\n}\n\nfragment WatchlistListItemFragment_assetprice on AssetPrice {\n  currency\n  lastPrice\n  change24Hour\n  marketCap\n}\n"
  }
};
})();

node.hash = "1a87ebbc2629abf6397d2f9ecf321f6f";

module.exports = node;
