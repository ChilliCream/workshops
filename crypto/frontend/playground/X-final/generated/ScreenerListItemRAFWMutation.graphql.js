/**
 * @generated SignedSource<<8035d67da93a7a01300eec2aefccd0bf>>
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
    "name": "ScreenerListItemRAFWMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RemoveAssetFromWatchlistPayload",
        "kind": "LinkedField",
        "name": "removeAssetFromWatchlist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "removedAsset",
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
    "name": "ScreenerListItemRAFWMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RemoveAssetFromWatchlistPayload",
        "kind": "LinkedField",
        "name": "removeAssetFromWatchlist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "removedAsset",
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
    "cacheID": "8f4fbd331c56b6b11416e78d9953b777",
    "id": null,
    "metadata": {},
    "name": "ScreenerListItemRAFWMutation",
    "operationKind": "mutation",
    "text": "mutation ScreenerListItemRAFWMutation(\n  $input: RemoveAssetFromWatchlistInput!\n) {\n  removeAssetFromWatchlist(input: $input) {\n    removedAsset {\n      isInWatchlist\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "78b9068838766c01e8a280b4a5da78df";

module.exports = node;
