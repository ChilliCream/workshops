/**
 * @generated SignedSource<<0acd2baff3a41e48293ce72ce8b3720e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type homeFeaturedCardFragment_asset$data = {
  readonly color: string;
  readonly price: {
    readonly change: {
      readonly history: {
        readonly nodes: ReadonlyArray<{
          readonly epoch: number;
          readonly price: number;
        } | null> | null;
      } | null;
    } | null;
    readonly change24Hour: number;
    readonly currency: string;
    readonly lastPrice: number;
  };
  readonly symbol: string;
  readonly " $fragmentType": "homeFeaturedCardFragment_asset";
};
export type homeFeaturedCardFragment_asset$key = {
  readonly " $data"?: homeFeaturedCardFragment_asset$data;
  readonly " $fragmentSpreads": FragmentRefs<"homeFeaturedCardFragment_asset">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "homeFeaturedCardFragment_asset",
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
        },
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "span",
              "value": "DAY"
            }
          ],
          "concreteType": "AssetPriceChange",
          "kind": "LinkedField",
          "name": "change",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "HistoryConnection",
              "kind": "LinkedField",
              "name": "history",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "AssetPriceHistory",
                  "kind": "LinkedField",
                  "name": "nodes",
                  "plural": true,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "epoch",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "price",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": "change(span:\"DAY\")"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Asset",
  "abstractKey": null
};

(node as any).hash = "ac45a25914d840e6f413ed03a13fa591";

export default node;
