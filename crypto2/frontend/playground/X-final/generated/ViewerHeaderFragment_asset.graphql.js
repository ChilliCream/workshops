/**
 * @generated SignedSource<<9dd334a1ab3430ca9196e80a78ad6249>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type ViewerHeaderFragment_asset$fragmentType: FragmentType;
export type ViewerHeaderFragment_asset$data = {|
  +hasAlerts: boolean,
  +id: string,
  +imageUrl: ?string,
  +isInWatchlist: ?boolean,
  +name: string,
  +symbol: string,
  +$fragmentType: ViewerHeaderFragment_asset$fragmentType,
|};
export type ViewerHeaderFragment_asset$key = {
  +$data?: ViewerHeaderFragment_asset$data,
  +$fragmentSpreads: ViewerHeaderFragment_asset$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ViewerHeaderFragment_asset",
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
      "kind": "ScalarField",
      "name": "hasAlerts",
      "storageKey": null
    }
  ],
  "type": "Asset",
  "abstractKey": null
};

(node/*: any*/).hash = "c9c29a12a666f2a95958709da29c6908";

module.exports = ((node/*: any*/)/*: Fragment<
  ViewerHeaderFragment_asset$fragmentType,
  ViewerHeaderFragment_asset$data,
>*/);
