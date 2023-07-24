/**
 * @generated SignedSource<<378f54830de274e4640e0e35c5c204e2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardSpotlightCardFragment_asset",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "nodes",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "DashboardSpotlightItemFragment_asset"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "AssetsConnection",
  "abstractKey": null
};

node.hash = "1af28335a4d097776754c36ec2e715de";

module.exports = node;
