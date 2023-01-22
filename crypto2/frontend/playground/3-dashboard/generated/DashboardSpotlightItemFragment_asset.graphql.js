/**
 * @generated SignedSource<<f9fd6ab2ec43d486f72c469b51667c8d>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type DashboardSpotlightItemFragment_asset$fragmentType: FragmentType;
export type DashboardSpotlightItemFragment_asset$data = {|
  +id: string,
  +imageUrl: ?string,
  +isInWatchlist: ?boolean,
  +name: string,
  +price: {|
    +change24Hour: number,
    +currency: string,
    +lastPrice: number,
  |},
  +symbol: string,
  +$fragmentType: DashboardSpotlightItemFragment_asset$fragmentType,
|};
export type DashboardSpotlightItemFragment_asset$key = {
  +$data?: DashboardSpotlightItemFragment_asset$data,
  +$fragmentSpreads: DashboardSpotlightItemFragment_asset$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardSpotlightItemFragment_asset",
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

(node/*: any*/).hash = "497b1dca0502fc8e3adcdf7bd9c11e6b";

module.exports = ((node/*: any*/)/*: Fragment<
  DashboardSpotlightItemFragment_asset$fragmentType,
  DashboardSpotlightItemFragment_asset$data,
>*/);
