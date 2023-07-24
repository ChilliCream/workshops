/**
 * @generated SignedSource<<3b61b0835506ffc596c5bf1cc47a0756>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardFeaturedFragment_query",
  "selections": [
    {
      "alias": "featured",
      "args": [
        {
          "kind": "Literal",
          "name": "where",
          "value": {
            "symbol": {
              "in": [
                "BTC",
                "ADA",
                "ALGO"
              ]
            }
          }
        }
      ],
      "concreteType": "AssetsConnection",
      "kind": "LinkedField",
      "name": "assets",
      "plural": false,
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
              "name": "DashboardFeaturedCardFragment_asset"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "assets(where:{\"symbol\":{\"in\":[\"BTC\",\"ADA\",\"ALGO\"]}})"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

node.hash = "0d35e9ce37c11408c4a6bbc1e0b27d9a";

module.exports = node;
