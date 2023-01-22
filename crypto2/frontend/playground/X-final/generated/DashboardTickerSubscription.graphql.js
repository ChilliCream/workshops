/**
 * @generated SignedSource<<ee08f7ceb20223dcf158154a488483aa>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import type { DashboardTickerItemFragment_assetprice$fragmentType } from "./DashboardTickerItemFragment_assetprice.graphql";
export type DashboardTickerSubscription$variables = {|
  symbols?: ?$ReadOnlyArray<string>,
|};
export type DashboardTickerSubscription$data = {|
  +onPriceChange: {|
    +$fragmentSpreads: DashboardTickerItemFragment_assetprice$fragmentType,
  |},
|};
export type DashboardTickerSubscription = {|
  response: DashboardTickerSubscription$data,
  variables: DashboardTickerSubscription$variables,
|};
*/

var node/*: ConcreteRequest*/ = (function(){
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

(node/*: any*/).hash = "7fdab90c9db1c4557a97491aadf2eae9";

module.exports = ((node/*: any*/)/*: GraphQLSubscription<
  DashboardTickerSubscription$variables,
  DashboardTickerSubscription$data,
>*/);
