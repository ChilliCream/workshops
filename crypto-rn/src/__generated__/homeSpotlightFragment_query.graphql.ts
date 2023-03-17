/**
 * @generated SignedSource<<2ecec082e3b5d205a36f23ae2a028c5a>>
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
      "kind": "Defer",
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "homeSpotlightGainersFragment_query"
        }
      ]
    },
    {
      "kind": "Defer",
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "homeSpotlightLosersFragment_query"
        }
      ]
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "40120ef619cd50a9eb588c0fa45724ce";

export default node;
