/**
 * @generated SignedSource<<721c2ea11bd9b216b83216e7cb0e2811>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type DashboardTickerItemFragment_asset$fragmentType: FragmentType;
export type DashboardTickerItemFragment_asset$data = {|
  +color: string,
  +price: {|
    +change24Hour: number,
    +currency: string,
    +lastPrice: number,
  |},
  +symbol: string,
  +$fragmentType: DashboardTickerItemFragment_asset$fragmentType,
|};
export type DashboardTickerItemFragment_asset$key = {
  +$data?: DashboardTickerItemFragment_asset$data,
  +$fragmentSpreads: DashboardTickerItemFragment_asset$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardTickerItemFragment_asset",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Asset",
  "abstractKey": null
};

(node/*: any*/).hash = "0618973344e263ce8d730c44fc78cb88";

export default node;
