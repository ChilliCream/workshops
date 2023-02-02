/**
 * @generated SignedSource<<724cbb86b8542b2cc3d896f1081980cd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeFeaturedFragment_query$data = {
  readonly featured: {
    readonly nodes: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"homeFeaturedCardFragment_asset">;
    }> | null;
  } | null;
  readonly " $fragmentType": "homeFeaturedFragment_query";
};
export type homeFeaturedFragment_query$key = {
  readonly " $data"?: homeFeaturedFragment_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"homeFeaturedFragment_query">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "homeFeaturedFragment_query",
  "selections": [
    {
      "alias": "featured",
      "args": [
        {
          "kind": "Literal",
          "name": "where",
          "value": {
            "symbol": {
              "in": [
                "BTC",
                "ADA",
                "ALGO"
              ]
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
              "name": "homeFeaturedCardFragment_asset"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "assets(where:{\"symbol\":{\"in\":[\"BTC\",\"ADA\",\"ALGO\"]}})"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "31a82a2a4533b72b7bacb1cb9dd17bd6";

export default node;
