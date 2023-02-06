/**
 * @generated SignedSource<<e32386836636d710949b97128079fb79>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ChangeSpan = "ALL" | "DAY" | "HOUR" | "MONTH" | "WEEK" | "YEAR";
export type ViewerSnapshotRefetchableQuery$variables = {
  id: string;
  span?: ChangeSpan | null;
};
export type ViewerSnapshotRefetchableQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"viewerSnapshotFragment_price">;
  } | null;
};
export type ViewerSnapshotRefetchableQuery = {
  response: ViewerSnapshotRefetchableQuery$data;
  variables: ViewerSnapshotRefetchableQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v1 = {
  "defaultValue": "DAY",
  "kind": "LocalArgument",
  "name": "span"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v3 = [
  {
    "kind": "Variable",
    "name": "span",
    "variableName": "span"
  }
],
v4 = {
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
    "name": "ViewerSnapshotRefetchableQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": (v3/*: any*/),
            "kind": "FragmentSpread",
            "name": "viewerSnapshotFragment_price"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ViewerSnapshotRefetchableQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
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
                "args": (v3/*: any*/),
                "concreteType": "AssetPriceChange",
                "kind": "LinkedField",
                "name": "change",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "percentageChange",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "HistoryConnection",
                    "kind": "LinkedField",
                    "name": "history",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetPriceHistory",
                        "kind": "LinkedField",
                        "name": "nodes",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "epoch",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "price",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "AssetPrice",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "99e1edb89e8865fb361d431dcf87cd54",
    "id": null,
    "metadata": {},
    "name": "ViewerSnapshotRefetchableQuery",
    "operationKind": "query",
    "text": "query ViewerSnapshotRefetchableQuery(\n  $span: ChangeSpan = DAY\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...viewerSnapshotFragment_price_brhWz\n    id\n  }\n}\n\nfragment viewerSnapshotFragment_price_brhWz on AssetPrice {\n  currency\n  lastPrice\n  change(span: $span) {\n    percentageChange\n    history {\n      nodes {\n        epoch\n        price\n      }\n    }\n    id\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "cbc878bd1156c79339a769b33daf34f4";

export default node;
