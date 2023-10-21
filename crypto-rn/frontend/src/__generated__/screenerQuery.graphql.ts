/**
 * @generated SignedSource<<bc569a6d35a79cf77a378e80f10b3e8e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type screenerQuery$variables = {};
export type screenerQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"screenerListFragment_query">;
};
export type screenerQuery = {
  response: screenerQuery$data;
  variables: screenerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  {
    "kind": "Literal",
    "name": "order",
    "value": {
      "price": {
        "marketCap": "DESC"
      }
    }
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "screenerQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "screenerListFragment_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "screenerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "AssetsConnection",
        "kind": "LinkedField",
        "name": "assets",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AssetsEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "symbol",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "name",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "imageUrl",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isInWatchlist",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AssetPrice",
                    "kind": "LinkedField",
                    "name": "price",
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
                      (v1/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "assets(first:10,order:{\"price\":{\"marketCap\":\"DESC\"}})"
      },
      {
        "alias": null,
        "args": (v0/*: any*/),
        "filters": [
          "where",
          "order"
        ],
        "handle": "connection",
        "key": "ScreenerList_assets",
        "kind": "LinkedHandle",
        "name": "assets"
      }
    ]
  },
  "params": {
    "cacheID": "a2e7823c5c9f3b0b953fc62615301b5b",
    "id": null,
    "metadata": {},
    "name": "screenerQuery",
    "operationKind": "query",
    "text": "query screenerQuery {\n  ...screenerListFragment_query\n}\n\nfragment screenerListFragment_query on Query {\n  assets(first: 10, order: {price: {marketCap: DESC}}) {\n    edges {\n      node {\n        id\n        symbol\n        ...screenerListItemFragment_asset\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment screenerListItemFragment_asset on Asset {\n  id\n  symbol\n  name\n  imageUrl\n  isInWatchlist\n  price {\n    currency\n    lastPrice\n    change24Hour\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "c99ddac7e9f470fcffad0978613637bf";

export default node;
