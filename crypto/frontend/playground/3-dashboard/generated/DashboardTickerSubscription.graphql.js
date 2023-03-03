/**
 * @generated SignedSource<<18387a206a4185efbde3afd6a6f1defc>>
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
    "name": "DashboardTickerSubscription",
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
            "name": "DashboardTickerItemFragment_assetprice"
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
    "name": "DashboardTickerSubscription",
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
    "cacheID": "96b7ec679d13628cab06a5bb852fa20b",
    "id": null,
    "metadata": {},
    "name": "DashboardTickerSubscription",
    "operationKind": "subscription",
    "text": "subscription DashboardTickerSubscription(\n  $symbols: [String!]\n) {\n  onPriceChange(symbols: $symbols) {\n    ...DashboardTickerItemFragment_assetprice\n    id\n  }\n}\n\nfragment DashboardTickerItemFragment_assetprice on AssetPrice {\n  currency\n  lastPrice\n  change24Hour\n}\n"
  }
};
})();

node.hash = "7fdab90c9db1c4557a97491aadf2eae9";

module.exports = node;
