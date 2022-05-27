/**
 * @generated SignedSource<<7df4cb0915b7d093b6f99bf16124766e>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type DashboardTickerSubscription$variables = {|
  symbols: $ReadOnlyArray<string>,
|};
export type DashboardTickerSubscription$data = {|
  +onPriceChange: {|
    +change24Hour: number,
    +currency: string,
    +lastPrice: number,
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
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "currency",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastPrice",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "change24Hour",
  "storageKey": null
};
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
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
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
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
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
    "cacheID": "8c2c80233df7162288b5c1f1ed5f6dc5",
    "id": null,
    "metadata": {},
    "name": "DashboardTickerSubscription",
    "operationKind": "subscription",
    "text": "subscription DashboardTickerSubscription(\n  $symbols: [String!]!\n) {\n  onPriceChange(symbols: $symbols) {\n    currency\n    lastPrice\n    change24Hour\n    id\n  }\n}\n"
  }
};
})();

(node/*: any*/).hash = "adc52de5497a76821c22545468511979";

export default node;
