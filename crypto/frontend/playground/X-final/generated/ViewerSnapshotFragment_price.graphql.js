/**
 * @generated SignedSource<<e951dd9c60cc4e67e82a0674321c5dc4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = {
  "argumentDefinitions": [
    {
      "defaultValue": "DAY",
      "kind": "LocalArgument",
      "name": "span"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": require('./ViewerSnapshotRefetchableQuery.graphql'),
      "identifierField": "id"
    }
  },
  "name": "ViewerSnapshotFragment_price",
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
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "span",
          "variableName": "span"
        }
      ],
      "concreteType": "AssetPriceChange",
      "kind": "LinkedField",
      "name": "change",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "percentageChange",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "HistoryConnection",
          "kind": "LinkedField",
          "name": "history",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "AssetPriceHistory",
              "kind": "LinkedField",
              "name": "nodes",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "epoch",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "price",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "AssetPrice",
  "abstractKey": null
};

node.hash = "92f04f73a86ad17b385a146cb370f432";

module.exports = node;
