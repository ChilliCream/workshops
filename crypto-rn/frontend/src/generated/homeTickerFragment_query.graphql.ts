/**
 * @generated SignedSource<<7cbb79ae1564af85f635068a30f0d7fd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeTickerFragment_query$data = {
  readonly ticker: {
    readonly nodes: ReadonlyArray<{
      readonly id: string;
      readonly symbol: string;
      readonly " $fragmentSpreads": FragmentRefs<"homeTickerItemFragment_asset">;
    }> | null;
  } | null;
  readonly " $fragmentType": "homeTickerFragment_query";
};
export type homeTickerFragment_query$key = {
  readonly " $data"?: homeTickerFragment_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"homeTickerFragment_query">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "homeTickerFragment_query",
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
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "id",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "symbol",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "homeTickerItemFragment_asset"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "assets(first:10,order:{\"price\":{\"tradableMarketCapRank\":\"ASC\"}})"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "4648a92f7abb07890b7af62867b621d6";

export default node;
