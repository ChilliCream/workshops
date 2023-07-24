/**
 * @generated SignedSource<<e89c72581575523c34c0325828153a0e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardSpotlightGainersFragment_query",
  "selections": [
    {
      "alias": "gainers",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 5
        },
        {
          "kind": "Literal",
          "name": "order",
          "value": {
            "price": {
              "change24Hour": "DESC"
            }
          }
        },
        {
          "kind": "Literal",
          "name": "where",
          "value": {
            "price": {
              "change24Hour": {
                "gt": 0
              }
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
          "args": null,
          "kind": "FragmentSpread",
          "name": "DashboardSpotlightCardFragment_asset"
        }
      ],
      "storageKey": "assets(first:5,order:{\"price\":{\"change24Hour\":\"DESC\"}},where:{\"price\":{\"change24Hour\":{\"gt\":0}}})"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

node.hash = "cd26250533df54389e0e78c36e15394c";

module.exports = node;
