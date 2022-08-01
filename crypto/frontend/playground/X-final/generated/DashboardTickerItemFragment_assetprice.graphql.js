/**
 * @generated SignedSource<<1a4802922121bd150e9f85e07a6fa3dd>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type DashboardTickerItemFragment_assetprice$fragmentType: FragmentType;
export type DashboardTickerItemFragment_assetprice$data = {|
  +change24Hour: number,
  +currency: string,
  +lastPrice: number,
  +$fragmentType: DashboardTickerItemFragment_assetprice$fragmentType,
|};
export type DashboardTickerItemFragment_assetprice$key = {
  +$data?: DashboardTickerItemFragment_assetprice$data,
  +$fragmentSpreads: DashboardTickerItemFragment_assetprice$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardTickerItemFragment_assetprice",
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
  "type": "AssetPrice",
  "abstractKey": null
};

(node/*: any*/).hash = "2dda8431cbfa961e61fe15f7ab2a5cf1";

module.exports = ((node/*: any*/)/*: Fragment<
  DashboardTickerItemFragment_assetprice$fragmentType,
  DashboardTickerItemFragment_assetprice$data,
>*/);
