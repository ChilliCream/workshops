/**
 * @generated SignedSource<<b471a2dd319af2db0d5a2e13be0d8508>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type ChangeSpan = "ALL" | "DAY" | "HOUR" | "MONTH" | "WEEK" | "YEAR";
export type ViewerSnapshotSubscription$variables = {|
  span: ChangeSpan,
  symbol: string,
|};
export type ViewerSnapshotSubscription$data = {|
  +onPriceChange: {|
    +change: ?{|
      +percentageChange: number,
    |},
    +currency: string,
    +lastPrice: number,
  |},
|};
export type ViewerSnapshotSubscription = {|
  response: ViewerSnapshotSubscription$data,
  variables: ViewerSnapshotSubscription$variables,
|};
*/

var node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "span"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "symbol"
},
v2 = [
  {
    "items": [
      {
        "kind": "Variable",
        "name": "symbols.0",
        "variableName": "symbol"
      }
    ],
    "kind": "ListValue",
    "name": "symbols"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "currency",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastPrice",
  "storageKey": null
},
v5 = [
  {
    "kind": "Variable",
    "name": "span",
    "variableName": "span"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "percentageChange",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ViewerSnapshotSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "AssetPrice",
        "kind": "LinkedField",
        "name": "onPriceChange",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": (v5/*: any*/),
            "concreteType": "AssetPriceChange",
            "kind": "LinkedField",
            "name": "change",
            "plural": false,
            "selections": [
              (v6/*: any*/)
            ],
            "storageKey": null
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ViewerSnapshotSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "AssetPrice",
        "kind": "LinkedField",
        "name": "onPriceChange",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": (v5/*: any*/),
            "concreteType": "AssetPriceChange",
            "kind": "LinkedField",
            "name": "change",
            "plural": false,
            "selections": [
              (v6/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "565e10037ad18c7bba8844553b5c1b3c",
    "id": null,
    "metadata": {},
    "name": "ViewerSnapshotSubscription",
    "operationKind": "subscription",
    "text": "subscription ViewerSnapshotSubscription(\n  $symbol: String!\n  $span: ChangeSpan!\n) {\n  onPriceChange(symbols: [$symbol]) {\n    currency\n    lastPrice\n    change(span: $span) {\n      percentageChange\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node/*: any*/).hash = "834a951b4510bf6b46af90f6d9493f34";

module.exports = ((node/*: any*/)/*: GraphQLSubscription<
  ViewerSnapshotSubscription$variables,
  ViewerSnapshotSubscription$data,
>*/);
