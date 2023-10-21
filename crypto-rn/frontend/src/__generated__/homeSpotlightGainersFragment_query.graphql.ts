/**
 * @generated SignedSource<<eb1647abceff79e279db6439372986c6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeSpotlightGainersFragment_query$data = {
  readonly gainers: {
    readonly " $fragmentSpreads": FragmentRefs<"homeSpotlightCardFragment_asset">;
  } | null;
  readonly " $fragmentType": "homeSpotlightGainersFragment_query";
};
export type homeSpotlightGainersFragment_query$key = {
  readonly " $data"?: homeSpotlightGainersFragment_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"homeSpotlightGainersFragment_query">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "homeSpotlightGainersFragment_query",
  "selections": [
    {
      "alias": "gainers",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 5
        },
        {
          "kind": "Literal",
          "name": "order",
          "value": {
            "price": {
              "change24Hour": "DESC"
            }
          }
        },
        {
          "kind": "Literal",
          "name": "where",
          "value": {
            "price": {
              "change24Hour": {
                "gt": 0
              }
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
          "args": null,
          "kind": "FragmentSpread",
          "name": "homeSpotlightCardFragment_asset"
        }
      ],
      "storageKey": "assets(first:5,order:{\"price\":{\"change24Hour\":\"DESC\"}},where:{\"price\":{\"change24Hour\":{\"gt\":0}}})"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "6ae0e1be78c43e1faa0e1f74e8e6fb62";

export default node;
