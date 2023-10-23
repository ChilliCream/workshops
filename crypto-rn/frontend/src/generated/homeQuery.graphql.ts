/**
 * @generated SignedSource<<bc9158862b6d1fcbe373eb0e6f60881e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeQuery$variables = {};
export type homeQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"homeFeaturedFragment_query" | "homeSpotlightFragment_query" | "homeTickerFragment_query">;
};
export type homeQuery = {
  response: homeQuery$data;
  variables: homeQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
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
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "change24Hour",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetPrice",
  "kind": "LinkedField",
  "name": "price",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v4/*: any*/),
    (v5/*: any*/),
    (v0/*: any*/)
  ],
  "storageKey": null
},
v7 = {
  "kind": "Literal",
  "name": "first",
  "value": 5
},
v8 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Asset",
    "kind": "LinkedField",
    "name": "nodes",
    "plural": true,
    "selections": [
      (v0/*: any*/),
      (v1/*: any*/),
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
      (v6/*: any*/)
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "homeQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "homeTickerFragment_query"
      },
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "homeFeaturedFragment_query"
      },
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "homeSpotlightFragment_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "homeQuery",
    "selections": [
      {
        "alias": "ticker",
        "args": [
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
                "tradableMarketCapRank": "ASC"
              }
            }
          }
        ],
        "concreteType": "AssetsConnection",
        "kind": "LinkedField",
        "name": "assets",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "nodes",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              (v2/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": "assets(first:10,order:{\"price\":{\"tradableMarketCapRank\":\"ASC\"}})"
      },
      {
        "alias": "featured",
        "args": [
          {
            "kind": "Literal",
            "name": "where",
            "value": {
              "symbol": {
                "in": [
                  "BTC",
                  "ADA",
                  "ALGO"
                ]
              }
            }
          }
        ],
        "concreteType": "AssetsConnection",
        "kind": "LinkedField",
        "name": "assets",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "nodes",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "AssetPrice",
                "kind": "LinkedField",
                "name": "price",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "span",
                        "value": "DAY"
                      }
                    ],
                    "concreteType": "AssetPriceChange",
                    "kind": "LinkedField",
                    "name": "change",
                    "plural": false,
                    "selections": [
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
                      (v0/*: any*/)
                    ],
                    "storageKey": "change(span:\"DAY\")"
                  },
                  (v0/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "assets(where:{\"symbol\":{\"in\":[\"BTC\",\"ADA\",\"ALGO\"]}})"
      },
      {
        "if": null,
        "kind": "Defer",
        "label": "homeSpotlightFragment_query$defer$gainers",
        "selections": [
          {
            "alias": "gainers",
            "args": [
              (v7/*: any*/),
              {
                "kind": "Literal",
                "name": "order",
                "value": {
                  "price": {
                    "change24Hour": "DESC"
                  }
                }
              },
              {
                "kind": "Literal",
                "name": "where",
                "value": {
                  "price": {
                    "change24Hour": {
                      "gt": 0
                    }
                  }
                }
              }
            ],
            "concreteType": "AssetsConnection",
            "kind": "LinkedField",
            "name": "assets",
            "plural": false,
            "selections": (v8/*: any*/),
            "storageKey": "assets(first:5,order:{\"price\":{\"change24Hour\":\"DESC\"}},where:{\"price\":{\"change24Hour\":{\"gt\":0}}})"
          }
        ]
      },
      {
        "if": null,
        "kind": "Defer",
        "label": "homeSpotlightFragment_query$defer$losers",
        "selections": [
          {
            "alias": "losers",
            "args": [
              (v7/*: any*/),
              {
                "kind": "Literal",
                "name": "order",
                "value": {
                  "price": {
                    "change24Hour": "ASC"
                  }
                }
              },
              {
                "kind": "Literal",
                "name": "where",
                "value": {
                  "price": {
                    "change24Hour": {
                      "lt": 0
                    }
                  }
                }
              }
            ],
            "concreteType": "AssetsConnection",
            "kind": "LinkedField",
            "name": "assets",
            "plural": false,
            "selections": (v8/*: any*/),
            "storageKey": "assets(first:5,order:{\"price\":{\"change24Hour\":\"ASC\"}},where:{\"price\":{\"change24Hour\":{\"lt\":0}}})"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "7c462e3d550eb580daabfb05a1811624",
    "id": null,
    "metadata": {},
    "name": "homeQuery",
    "operationKind": "query",
    "text": "query homeQuery {\n  ...homeTickerFragment_query\n  ...homeFeaturedFragment_query\n  ...homeSpotlightFragment_query\n}\n\nfragment homeFeaturedCardFragment_asset on Asset {\n  symbol\n  color\n  price {\n    currency\n    lastPrice\n    change24Hour\n    change(span: DAY) {\n      history {\n        nodes {\n          epoch\n          price\n        }\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment homeFeaturedFragment_query on Query {\n  featured: assets(where: {symbol: {in: [\"BTC\", \"ADA\", \"ALGO\"]}}) {\n    nodes {\n      id\n      ...homeFeaturedCardFragment_asset\n    }\n  }\n}\n\nfragment homeSpotlightCardFragment_asset on AssetsConnection {\n  nodes {\n    id\n    ...homeSpotlightItemFragment_asset\n  }\n}\n\nfragment homeSpotlightFragment_query on Query {\n  ...homeSpotlightGainersFragment_query @defer(label: \"homeSpotlightFragment_query$defer$gainers\")\n  ...homeSpotlightLosersFragment_query @defer(label: \"homeSpotlightFragment_query$defer$losers\")\n}\n\nfragment homeSpotlightGainersFragment_query on Query {\n  gainers: assets(first: 5, where: {price: {change24Hour: {gt: 0}}}, order: {price: {change24Hour: DESC}}) {\n    ...homeSpotlightCardFragment_asset\n  }\n}\n\nfragment homeSpotlightItemFragment_asset on Asset {\n  id\n  symbol\n  name\n  imageUrl\n  isInWatchlist\n  price {\n    currency\n    lastPrice\n    change24Hour\n    id\n  }\n}\n\nfragment homeSpotlightLosersFragment_query on Query {\n  losers: assets(first: 5, where: {price: {change24Hour: {lt: 0}}}, order: {price: {change24Hour: ASC}}) {\n    ...homeSpotlightCardFragment_asset\n  }\n}\n\nfragment homeTickerFragment_query on Query {\n  ticker: assets(first: 10, order: {price: {tradableMarketCapRank: ASC}}) {\n    nodes {\n      id\n      symbol\n      ...homeTickerItemFragment_asset\n    }\n  }\n}\n\nfragment homeTickerItemFragment_asset on Asset {\n  symbol\n  color\n  price {\n    currency\n    lastPrice\n    change24Hour\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f2601263a57e09d9e9d1b4ae69b99cca";

export default node;
