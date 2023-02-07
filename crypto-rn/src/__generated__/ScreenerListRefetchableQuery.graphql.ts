/**
 * @generated SignedSource<<52640b46ce04b2aadba39e335c99e19f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SortEnumType = "ASC" | "DESC";
export type AssetSortInput = {
  name?: SortEnumType | null;
  price?: AssetPriceSortInput | null;
  slug?: SortEnumType | null;
  symbol?: SortEnumType | null;
};
export type AssetPriceSortInput = {
  asset?: AssetSortInput | null;
  assetId?: SortEnumType | null;
  change24Hour?: SortEnumType | null;
  circulatingSupply?: SortEnumType | null;
  currency?: SortEnumType | null;
  high24Hour?: SortEnumType | null;
  id?: SortEnumType | null;
  lastPrice?: SortEnumType | null;
  low24Hour?: SortEnumType | null;
  marketCap?: SortEnumType | null;
  maxSupply?: SortEnumType | null;
  modifiedAt?: SortEnumType | null;
  open24Hour?: SortEnumType | null;
  symbol?: SortEnumType | null;
  tradableMarketCapRank?: SortEnumType | null;
  tradingActivity?: SortEnumType | null;
  volume24Hour?: SortEnumType | null;
  volumePercentChange24Hour?: SortEnumType | null;
};
export type AssetFilterInput = {
  and?: ReadonlyArray<AssetFilterInput> | null;
  description?: StringOperationFilterInput | null;
  name?: StringOperationFilterInput | null;
  or?: ReadonlyArray<AssetFilterInput> | null;
  price?: AssetPriceFilterInput | null;
  slug?: StringOperationFilterInput | null;
  symbol?: StringOperationFilterInput | null;
};
export type StringOperationFilterInput = {
  and?: ReadonlyArray<StringOperationFilterInput> | null;
  contains?: string | null;
  endsWith?: string | null;
  eq?: string | null;
  in?: ReadonlyArray<string | null> | null;
  ncontains?: string | null;
  nendsWith?: string | null;
  neq?: string | null;
  nin?: ReadonlyArray<string | null> | null;
  nstartsWith?: string | null;
  or?: ReadonlyArray<StringOperationFilterInput> | null;
  startsWith?: string | null;
};
export type AssetPriceFilterInput = {
  and?: ReadonlyArray<AssetPriceFilterInput> | null;
  asset?: AssetFilterInput | null;
  assetId?: IntOperationFilterInput | null;
  change24Hour?: FloatOperationFilterInput | null;
  circulatingSupply?: FloatOperationFilterInput | null;
  currency?: StringOperationFilterInput | null;
  high24Hour?: FloatOperationFilterInput | null;
  id?: IntOperationFilterInput | null;
  lastPrice?: FloatOperationFilterInput | null;
  low24Hour?: FloatOperationFilterInput | null;
  marketCap?: FloatOperationFilterInput | null;
  maxSupply?: FloatOperationFilterInput | null;
  modifiedAt?: DateTimeOperationFilterInput | null;
  open24Hour?: FloatOperationFilterInput | null;
  or?: ReadonlyArray<AssetPriceFilterInput> | null;
  symbol?: StringOperationFilterInput | null;
  tradableMarketCapRank?: FloatOperationFilterInput | null;
  tradingActivity?: FloatOperationFilterInput | null;
  volume24Hour?: FloatOperationFilterInput | null;
  volumePercentChange24Hour?: FloatOperationFilterInput | null;
};
export type IntOperationFilterInput = {
  eq?: number | null;
  gt?: number | null;
  gte?: number | null;
  in?: ReadonlyArray<number | null> | null;
  lt?: number | null;
  lte?: number | null;
  neq?: number | null;
  ngt?: number | null;
  ngte?: number | null;
  nin?: ReadonlyArray<number | null> | null;
  nlt?: number | null;
  nlte?: number | null;
};
export type FloatOperationFilterInput = {
  eq?: number | null;
  gt?: number | null;
  gte?: number | null;
  in?: ReadonlyArray<number | null> | null;
  lt?: number | null;
  lte?: number | null;
  neq?: number | null;
  ngt?: number | null;
  ngte?: number | null;
  nin?: ReadonlyArray<number | null> | null;
  nlt?: number | null;
  nlte?: number | null;
};
export type DateTimeOperationFilterInput = {
  eq?: string | null;
  gt?: string | null;
  gte?: string | null;
  in?: ReadonlyArray<string | null> | null;
  lt?: string | null;
  lte?: string | null;
  neq?: string | null;
  ngt?: string | null;
  ngte?: string | null;
  nin?: ReadonlyArray<string | null> | null;
  nlt?: string | null;
  nlte?: string | null;
};
export type ScreenerListRefetchableQuery$variables = {
  count?: number | null;
  cursor?: string | null;
  order?: ReadonlyArray<AssetSortInput> | null;
  where?: AssetFilterInput | null;
};
export type ScreenerListRefetchableQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"screenerListFragment_query">;
};
export type ScreenerListRefetchableQuery = {
  response: ScreenerListRefetchableQuery$data;
  variables: ScreenerListRefetchableQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": 10,
    "kind": "LocalArgument",
    "name": "count"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cursor"
  },
  {
    "defaultValue": {
      "price": {
        "marketCap": "DESC"
      }
    },
    "kind": "LocalArgument",
    "name": "order"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "where"
  }
],
v1 = {
  "kind": "Variable",
  "name": "order",
  "variableName": "order"
},
v2 = {
  "kind": "Variable",
  "name": "where",
  "variableName": "where"
},
v3 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v1/*: any*/),
  (v2/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ScreenerListRefetchableQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "screenerListFragment_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ScreenerListRefetchableQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
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
                  (v4/*: any*/),
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
                      (v4/*: any*/)
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
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
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
    "cacheID": "bbec841461ec8af98af4e0597df90912",
    "id": null,
    "metadata": {},
    "name": "ScreenerListRefetchableQuery",
    "operationKind": "query",
    "text": "query ScreenerListRefetchableQuery(\n  $count: Int = 10\n  $cursor: String\n  $order: [AssetSortInput!] = {price: {marketCap: DESC}}\n  $where: AssetFilterInput\n) {\n  ...screenerListFragment_query_2KVBjJ\n}\n\nfragment screenerListFragment_query_2KVBjJ on Query {\n  assets(after: $cursor, first: $count, where: $where, order: $order) {\n    edges {\n      node {\n        id\n        symbol\n        ...screenerListItemFragment_asset\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment screenerListItemFragment_asset on Asset {\n  id\n  symbol\n  name\n  imageUrl\n  isInWatchlist\n  price {\n    currency\n    lastPrice\n    change24Hour\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "9239d3aba73263ec95b4f97e5af118ab";

export default node;
