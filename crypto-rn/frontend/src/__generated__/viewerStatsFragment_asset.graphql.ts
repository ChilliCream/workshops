/**
 * @generated SignedSource<<0901fe9308348cc0b19208af8232a323>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type viewerStatsFragment_asset$data = {
  readonly price: {
    readonly circulatingSupply: number;
    readonly currency: string;
    readonly marketCap: number;
    readonly maxSupply: number;
    readonly tradableMarketCapRank: number;
    readonly tradingActivity: number;
    readonly volume24Hour: number;
    readonly volumePercentChange24Hour: number;
  };
  readonly " $fragmentType": "viewerStatsFragment_asset";
};
export type viewerStatsFragment_asset$key = {
  readonly " $data"?: viewerStatsFragment_asset$data;
  readonly " $fragmentSpreads": FragmentRefs<"viewerStatsFragment_asset">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "viewerStatsFragment_asset",
  "selections": [
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
    }
  ],
  "type": "Asset",
  "abstractKey": null
};

(node as any).hash = "d5fe635a8426f177075ad89ad281f042";

export default node;
