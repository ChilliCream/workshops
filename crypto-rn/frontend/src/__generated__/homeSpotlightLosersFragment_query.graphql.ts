/**
 * @generated SignedSource<<9104713443f7b430e7390117ec9117b0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeSpotlightLosersFragment_query$data = {
  readonly losers: {
    readonly " $fragmentSpreads": FragmentRefs<"homeSpotlightCardFragment_asset">;
  } | null;
  readonly " $fragmentType": "homeSpotlightLosersFragment_query";
};
export type homeSpotlightLosersFragment_query$key = {
  readonly " $data"?: homeSpotlightLosersFragment_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"homeSpotlightLosersFragment_query">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "homeSpotlightLosersFragment_query",
  "selections": [
    {
      "alias": "losers",
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
              "change24Hour": "ASC"
            }
          }
        },
        {
          "kind": "Literal",
          "name": "where",
          "value": {
            "price": {
              "change24Hour": {
                "lt": 0
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
      "storageKey": "assets(first:5,order:{\"price\":{\"change24Hour\":\"ASC\"}},where:{\"price\":{\"change24Hour\":{\"lt\":0}}})"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "1fb80f13878825bcd9aef79b54b18b13";

export default node;
