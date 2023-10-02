/**
 * @generated SignedSource<<496765a88ec6d5ad4cafb1301c155782>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeTickerItemFragment_asset$data = {
  readonly color: string;
  readonly price: {
    readonly change24Hour: number;
    readonly currency: string;
    readonly lastPrice: number;
  };
  readonly symbol: string;
  readonly " $fragmentType": "homeTickerItemFragment_asset";
};
export type homeTickerItemFragment_asset$key = {
  readonly " $data"?: homeTickerItemFragment_asset$data;
  readonly " $fragmentSpreads": FragmentRefs<"homeTickerItemFragment_asset">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "homeTickerItemFragment_asset",
  "selections": [
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
          "args": null,
          "kind": "ScalarField",
          "name": "change24Hour",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Asset",
  "abstractKey": null
};

(node as any).hash = "33f15398864f00ea1644753ad1366db1";

export default node;
