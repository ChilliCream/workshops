/**
 * @generated SignedSource<<5e97ad140d61a43c4a5d94416dcf7a19>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = {
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

node.hash = "2732126358a6561b7e64ca84cdb8c890";

module.exports = node;
