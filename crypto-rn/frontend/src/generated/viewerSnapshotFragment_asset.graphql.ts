/**
 * @generated SignedSource<<61b73c28479fa029afa6131a409fec96>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type viewerSnapshotFragment_asset$data = {
  readonly color: string;
  readonly price: {
    readonly " $fragmentSpreads": FragmentRefs<"viewerSnapshotFragment_price">;
  };
  readonly symbol: string;
  readonly " $fragmentType": "viewerSnapshotFragment_asset";
};
export type viewerSnapshotFragment_asset$key = {
  readonly " $data"?: viewerSnapshotFragment_asset$data;
  readonly " $fragmentSpreads": FragmentRefs<"viewerSnapshotFragment_asset">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "viewerSnapshotFragment_asset",
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
          "args": null,
          "kind": "FragmentSpread",
          "name": "viewerSnapshotFragment_price"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Asset",
  "abstractKey": null
};

(node as any).hash = "3a8a9b16f0d66ef3945418e31605afc1";

export default node;
