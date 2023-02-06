/**
 * @generated SignedSource<<c62d7de8a67f20a1de5a14fe39e65aea>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type viewerOverviewFragment_asset$data = {
  readonly description: string | null;
  readonly " $fragmentType": "viewerOverviewFragment_asset";
};
export type viewerOverviewFragment_asset$key = {
  readonly " $data"?: viewerOverviewFragment_asset$data;
  readonly " $fragmentSpreads": FragmentRefs<"viewerOverviewFragment_asset">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "viewerOverviewFragment_asset",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "Asset",
  "abstractKey": null
};

(node as any).hash = "1b79b944b2abff281a4933b629d53fbb";

export default node;
