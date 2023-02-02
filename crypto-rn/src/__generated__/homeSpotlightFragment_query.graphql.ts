/**
 * @generated SignedSource<<f46c7335e29be08965007a34b7dfbc7d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeSpotlightFragment_query$data = {
  readonly " $fragmentSpreads": FragmentRefs<"homeSpotlightGainersFragment_query" | "homeSpotlightLosersFragment_query">;
  readonly " $fragmentType": "homeSpotlightFragment_query";
};
export type homeSpotlightFragment_query$key = {
  readonly " $data"?: homeSpotlightFragment_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"homeSpotlightFragment_query">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "homeSpotlightFragment_query",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "homeSpotlightGainersFragment_query"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "homeSpotlightLosersFragment_query"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "49b87c5d83e24e588a16356571074a3d";

export default node;
