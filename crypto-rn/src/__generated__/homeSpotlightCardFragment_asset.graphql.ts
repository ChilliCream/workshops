/**
 * @generated SignedSource<<ae755d57568291013050a706bfad9084>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeSpotlightCardFragment_asset$data = {
  readonly nodes: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"homeSpotlightItemFragment_asset">;
  }> | null;
  readonly " $fragmentType": "homeSpotlightCardFragment_asset";
};
export type homeSpotlightCardFragment_asset$key = {
  readonly " $data"?: homeSpotlightCardFragment_asset$data;
  readonly " $fragmentSpreads": FragmentRefs<"homeSpotlightCardFragment_asset">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "homeSpotlightCardFragment_asset",
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
          "args": null,
          "kind": "FragmentSpread",
          "name": "homeSpotlightItemFragment_asset"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "AssetsConnection",
  "abstractKey": null
};

(node as any).hash = "351f776a2c98d170eb972be51526b16b";

export default node;
