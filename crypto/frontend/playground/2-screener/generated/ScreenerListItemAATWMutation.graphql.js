/**
 * @generated SignedSource<<c0c0528b9e3763a404facf4e3d31e5c0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isInWatchlist",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ScreenerListItemAATWMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AddAssetToWatchlistPayload",
        "kind": "LinkedField",
        "name": "addAssetToWatchlist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "addedAsset",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ScreenerListItemAATWMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AddAssetToWatchlistPayload",
        "kind": "LinkedField",
        "name": "addAssetToWatchlist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "addedAsset",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "291782742753abcb74a86b68a6af89a3",
    "id": null,
    "metadata": {},
    "name": "ScreenerListItemAATWMutation",
    "operationKind": "mutation",
    "text": "mutation ScreenerListItemAATWMutation(\n  $input: AddAssetToWatchlistInput!\n) {\n  addAssetToWatchlist(input: $input) {\n    addedAsset {\n      isInWatchlist\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "5cfe86951f1476f9b3d999e0e1e183ce";

module.exports = node;
