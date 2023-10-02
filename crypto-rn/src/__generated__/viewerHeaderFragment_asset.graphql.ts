/**
 * @generated SignedSource<<127711283d984ecdb3ef13234790b37a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type viewerHeaderFragment_asset$data = {
  readonly hasAlerts: boolean;
  readonly id: string;
  readonly imageUrl: string | null;
  readonly isInWatchlist: boolean | null;
  readonly name: string;
  readonly symbol: string;
  readonly " $fragmentType": "viewerHeaderFragment_asset";
};
export type viewerHeaderFragment_asset$key = {
  readonly " $data"?: viewerHeaderFragment_asset$data;
  readonly " $fragmentSpreads": FragmentRefs<"viewerHeaderFragment_asset">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "viewerHeaderFragment_asset",
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
    }
  ],
  "type": "Asset",
  "abstractKey": null
};

(node as any).hash = "040cc4b1f84d83c1953254b9ccf415a8";

export default node;
