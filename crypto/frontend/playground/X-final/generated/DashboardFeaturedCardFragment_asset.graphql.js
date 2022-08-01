/**
 * @generated SignedSource<<0cfd7da82c35096c3f05ee4210d79220>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type DashboardFeaturedCardFragment_asset$fragmentType: FragmentType;
export type DashboardFeaturedCardFragment_asset$data = {|
  +color: string,
  +price: {|
    +change: ?{|
      +history: ?{|
        +nodes: ?$ReadOnlyArray<?{|
          +epoch: number,
          +price: number,
        |}>,
      |},
    |},
    +change24Hour: number,
    +currency: string,
    +lastPrice: number,
  |},
  +symbol: string,
  +$fragmentType: DashboardFeaturedCardFragment_asset$fragmentType,
|};
export type DashboardFeaturedCardFragment_asset$key = {
  +$data?: DashboardFeaturedCardFragment_asset$data,
  +$fragmentSpreads: DashboardFeaturedCardFragment_asset$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardFeaturedCardFragment_asset",
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

(node/*: any*/).hash = "84fbaa9ed175eb10f5836bccda54fd3c";

module.exports = ((node/*: any*/)/*: Fragment<
  DashboardFeaturedCardFragment_asset$fragmentType,
  DashboardFeaturedCardFragment_asset$data,
>*/);
