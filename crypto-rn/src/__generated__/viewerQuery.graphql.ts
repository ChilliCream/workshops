/**
 * @generated SignedSource<<865ab67e5c31300479c86f4fad4d85b1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type viewerQuery$variables = {
  symbol: string;
};
export type viewerQuery$data = {
  readonly assetBySymbol: {
    readonly " $fragmentSpreads": FragmentRefs<"viewerHeaderFragment_asset" | "viewerOverviewFragment_asset" | "viewerSnapshotFragment_asset" | "viewerStatsFragment_asset">;
  } | null;
};
export type viewerQuery = {
  response: viewerQuery$data;
  variables: viewerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "symbol"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "symbol",
    "variableName": "symbol"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "viewerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Asset",
        "kind": "LinkedField",
        "name": "assetBySymbol",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "viewerHeaderFragment_asset"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "viewerSnapshotFragment_asset"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "viewerStatsFragment_asset"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "viewerOverviewFragment_asset"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "viewerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Asset",
        "kind": "LinkedField",
        "name": "assetBySymbol",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
            "kind": "ScalarField",
            "name": "hasAlerts",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "color",
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
                  (v2/*: any*/)
                ],
                "storageKey": "change(span:\"DAY\")"
              },
              (v2/*: any*/),
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
                "name": "volume24Hour",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "volumePercentChange24Hour",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "maxSupply",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "circulatingSupply",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "tradingActivity",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "tradableMarketCapRank",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "bd823d7ce27ab01e3447347656931906",
    "id": null,
    "metadata": {},
    "name": "viewerQuery",
    "operationKind": "query",
    "text": "query viewerQuery(\n  $symbol: String!\n) {\n  assetBySymbol(symbol: $symbol) {\n    ...viewerHeaderFragment_asset\n    ...viewerSnapshotFragment_asset\n    ...viewerStatsFragment_asset\n    ...viewerOverviewFragment_asset\n    id\n  }\n}\n\nfragment viewerHeaderFragment_asset on Asset {\n  id\n  symbol\n  name\n  imageUrl\n  isInWatchlist\n  hasAlerts\n}\n\nfragment viewerOverviewFragment_asset on Asset {\n  description\n}\n\nfragment viewerSnapshotFragment_asset on Asset {\n  symbol\n  color\n  price {\n    ...viewerSnapshotFragment_price\n    id\n  }\n}\n\nfragment viewerSnapshotFragment_price on AssetPrice {\n  currency\n  lastPrice\n  change(span: DAY) {\n    percentageChange\n    history {\n      nodes {\n        epoch\n        price\n      }\n    }\n    id\n  }\n  id\n}\n\nfragment viewerStatsFragment_asset on Asset {\n  price {\n    currency\n    marketCap\n    volume24Hour\n    volumePercentChange24Hour\n    maxSupply\n    circulatingSupply\n    tradingActivity\n    tradableMarketCapRank\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "72662af1cd1ef653ccd3e5eea5527012";

export default node;
