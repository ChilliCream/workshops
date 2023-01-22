/**
 * @generated SignedSource<<b62dc0f098b2c47dea97ffb81f534015>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type AlertsActionsAAFragment_asset$fragmentType: FragmentType;
export type AlertsActionsAAFragment_asset$data = {|
  +id: string,
  +price: {|
    +currency: string,
    +lastPrice: number,
  |},
  +symbol: string,
  +$fragmentType: AlertsActionsAAFragment_asset$fragmentType,
|};
export type AlertsActionsAAFragment_asset$key = {
  +$data?: AlertsActionsAAFragment_asset$data,
  +$fragmentSpreads: AlertsActionsAAFragment_asset$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AlertsActionsAAFragment_asset",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Asset",
  "abstractKey": null
};

(node/*: any*/).hash = "f1751ec4692158e40be5afe9bf6f514a";

module.exports = ((node/*: any*/)/*: Fragment<
  AlertsActionsAAFragment_asset$fragmentType,
  AlertsActionsAAFragment_asset$data,
>*/);
