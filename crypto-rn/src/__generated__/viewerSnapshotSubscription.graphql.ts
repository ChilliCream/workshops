/**
 * @generated SignedSource<<2ce5d09a572c73da98a61f62203a09da>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type ChangeSpan = "ALL" | "DAY" | "HOUR" | "MONTH" | "WEEK" | "YEAR";
export type viewerSnapshotSubscription$variables = {
  span: ChangeSpan;
  symbol: string;
};
export type viewerSnapshotSubscription$data = {
  readonly onPriceChange: {
    readonly change: {
      readonly percentageChange: number;
    } | null;
    readonly currency: string;
    readonly lastPrice: number;
  };
};
export type viewerSnapshotSubscription = {
  response: viewerSnapshotSubscription$data;
  variables: viewerSnapshotSubscription$variables;
};

const node: ConcreteRequest = (function(){
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
    "name": "viewerSnapshotSubscription",
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
    "name": "viewerSnapshotSubscription",
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
    "cacheID": "0079e9abf1fbcc51b648e5cdfd586afd",
    "id": null,
    "metadata": {},
    "name": "viewerSnapshotSubscription",
    "operationKind": "subscription",
    "text": "subscription viewerSnapshotSubscription(\n  $symbol: String!\n  $span: ChangeSpan!\n) {\n  onPriceChange(symbols: [$symbol]) {\n    currency\n    lastPrice\n    change(span: $span) {\n      percentageChange\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f2881a7ed44e99d1e6a642d8966d7658";

export default node;
