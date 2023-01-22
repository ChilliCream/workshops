/**
 * @generated SignedSource<<37155ccd4b3654078b9dc78d3484bd24>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { DashboardSpotlightGainersFragment_query$fragmentType } from "./DashboardSpotlightGainersFragment_query.graphql";
import type { DashboardSpotlightLosersFragment_query$fragmentType } from "./DashboardSpotlightLosersFragment_query.graphql";
import type { FragmentType } from "relay-runtime";
declare export opaque type DashboardSpotlightFragment_query$fragmentType: FragmentType;
export type DashboardSpotlightFragment_query$data = {|
  +$fragmentSpreads: DashboardSpotlightGainersFragment_query$fragmentType & DashboardSpotlightLosersFragment_query$fragmentType,
  +$fragmentType: DashboardSpotlightFragment_query$fragmentType,
|};
export type DashboardSpotlightFragment_query$key = {
  +$data?: DashboardSpotlightFragment_query$data,
  +$fragmentSpreads: DashboardSpotlightFragment_query$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardSpotlightFragment_query",
  "selections": [
    {
      "kind": "Defer",
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "DashboardSpotlightGainersFragment_query"
        }
      ]
    },
    {
      "kind": "Defer",
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "DashboardSpotlightLosersFragment_query"
        }
      ]
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node/*: any*/).hash = "2732126358a6561b7e64ca84cdb8c890";

module.exports = ((node/*: any*/)/*: Fragment<
  DashboardSpotlightFragment_query$fragmentType,
  DashboardSpotlightFragment_query$data,
>*/);
