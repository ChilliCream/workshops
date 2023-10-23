/**
 * @generated SignedSource<<de079f11f8a2bc2f21651205b95b8e49>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeTickerItemFragment_assetprice$data = {
  readonly change24Hour: number;
  readonly currency: string;
  readonly lastPrice: number;
  readonly " $fragmentType": "homeTickerItemFragment_assetprice";
};
export type homeTickerItemFragment_assetprice$key = {
  readonly " $data"?: homeTickerItemFragment_assetprice$data;
  readonly " $fragmentSpreads": FragmentRefs<"homeTickerItemFragment_assetprice">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "homeTickerItemFragment_assetprice",
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
  "type": "AssetPrice",
  "abstractKey": null
};

(node as any).hash = "af66e2dc54f7b8a0ddcfe1da5df3376f";

export default node;
