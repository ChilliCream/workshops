/**
 * @generated SignedSource<<3c398735c68f3a62256cef4f890a1d36>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type WatchlistListItemFragment_asset$fragmentType: FragmentType;
export type WatchlistListItemFragment_asset$data = {|
  +id: string,
  +imageUrl: ?string,
  +isInWatchlist: ?boolean,
  +name: string,
  +price: {|
    +change24Hour: number,
    +currency: string,
    +lastPrice: number,
    +marketCap: number,
  |},
  +symbol: string,
  +$fragmentType: WatchlistListItemFragment_asset$fragmentType,
|};
export type WatchlistListItemFragment_asset$key = {
  +$data?: WatchlistListItemFragment_asset$data,
  +$fragmentSpreads: WatchlistListItemFragment_asset$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WatchlistListItemFragment_asset",
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
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "marketCap",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Asset",
  "abstractKey": null
};

(node/*: any*/).hash = "7b1ddbb0b75db1c2d13dbfeeb6c7c5ac";

module.exports = ((node/*: any*/)/*: Fragment<
  WatchlistListItemFragment_asset$fragmentType,
  WatchlistListItemFragment_asset$data,
>*/);
