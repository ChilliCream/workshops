/**
 * @generated SignedSource<<f74b280178e91571d9af618e8464a3f3>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type WatchlistListItemFragment_assetprice$fragmentType: FragmentType;
export type WatchlistListItemFragment_assetprice$data = {|
  +change24Hour: number,
  +currency: string,
  +lastPrice: number,
  +marketCap: number,
  +$fragmentType: WatchlistListItemFragment_assetprice$fragmentType,
|};
export type WatchlistListItemFragment_assetprice$key = {
  +$data?: WatchlistListItemFragment_assetprice$data,
  +$fragmentSpreads: WatchlistListItemFragment_assetprice$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WatchlistListItemFragment_assetprice",
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
  "type": "AssetPrice",
  "abstractKey": null
};

(node/*: any*/).hash = "b5130efcee1a3d8ce1a16ba094b97457";

module.exports = ((node/*: any*/)/*: Fragment<
  WatchlistListItemFragment_assetprice$fragmentType,
  WatchlistListItemFragment_assetprice$data,
>*/);
