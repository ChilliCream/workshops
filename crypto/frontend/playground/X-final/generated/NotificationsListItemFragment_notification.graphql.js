/**
 * @generated SignedSource<<f6de7ca6e0ff4738862487c1794a4207>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type NotificationsListItemFragment_notification$fragmentType: FragmentType;
export type NotificationsListItemFragment_notification$data = {|
  +asset: {|
    +imageUrl: ?string,
    +name: string,
    +price: {|
      +currency: string,
      +lastPrice: number,
    |},
    +symbol: string,
  |},
  +id: string,
  +message: ?string,
  +read: boolean,
  +$fragmentType: NotificationsListItemFragment_notification$fragmentType,
|};
export type NotificationsListItemFragment_notification$key = {
  +$data?: NotificationsListItemFragment_notification$data,
  +$fragmentSpreads: NotificationsListItemFragment_notification$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "NotificationsListItemFragment_notification",
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
      "name": "message",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "read",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "asset",
      "plural": false,
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
      "storageKey": null
    }
  ],
  "type": "Notification",
  "abstractKey": null
};

(node/*: any*/).hash = "e8bc540efb1bcd4d6c58053720454371";

module.exports = ((node/*: any*/)/*: Fragment<
  NotificationsListItemFragment_notification$fragmentType,
  NotificationsListItemFragment_notification$data,
>*/);
