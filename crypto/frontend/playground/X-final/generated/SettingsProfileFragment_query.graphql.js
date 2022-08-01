/**
 * @generated SignedSource<<38da308a1df07721a6ab56df605ce069>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type SettingsProfileFragment_query$fragmentType: FragmentType;
export type SettingsProfileFragment_query$data = {|
  +me: ?{|
    +displayName: ?string,
    +id: string,
    +imageUrl: ?string,
    +name: string,
  |},
  +$fragmentType: SettingsProfileFragment_query$fragmentType,
|};
export type SettingsProfileFragment_query$key = {
  +$data?: SettingsProfileFragment_query$data,
  +$fragmentSpreads: SettingsProfileFragment_query$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SettingsProfileFragment_query",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "me",
      "plural": false,
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
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "displayName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "imageUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node/*: any*/).hash = "44e477a33e75832ed8eac68415b459a6";

module.exports = ((node/*: any*/)/*: Fragment<
  SettingsProfileFragment_query$fragmentType,
  SettingsProfileFragment_query$data,
>*/);
