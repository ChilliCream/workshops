/**
 * @generated SignedSource<<a9d4a3317045ecf5a4d4268427ff7f68>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type ViewerResourcesFragment_asset$fragmentType: FragmentType;
export type ViewerResourcesFragment_asset$data = {|
  +website: ?string,
  +whitePaper: ?string,
  +$fragmentType: ViewerResourcesFragment_asset$fragmentType,
|};
export type ViewerResourcesFragment_asset$key = {
  +$data?: ViewerResourcesFragment_asset$data,
  +$fragmentSpreads: ViewerResourcesFragment_asset$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ViewerResourcesFragment_asset",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "website",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "whitePaper",
      "storageKey": null
    }
  ],
  "type": "Asset",
  "abstractKey": null
};

(node/*: any*/).hash = "4ca4fd7c05281be9cdd29e6bf184d6f9";

module.exports = ((node/*: any*/)/*: Fragment<
  ViewerResourcesFragment_asset$fragmentType,
  ViewerResourcesFragment_asset$data,
>*/);
