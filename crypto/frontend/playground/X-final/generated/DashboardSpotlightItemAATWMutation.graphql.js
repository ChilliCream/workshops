/**
 * @generated SignedSource<<0953e3aeb3aaa753311a2181e29831bb>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddAssetToWatchlistInput = {|
  symbol: string,
|};
export type DashboardSpotlightItemAATWMutation$variables = {|
  input: AddAssetToWatchlistInput,
|};
export type DashboardSpotlightItemAATWMutation$data = {|
  +addAssetToWatchlist: {|
    +addedAsset: ?{|
      +isInWatchlist: ?boolean,
    |},
  |},
|};
export type DashboardSpotlightItemAATWMutation = {|
  response: DashboardSpotlightItemAATWMutation$data,
  variables: DashboardSpotlightItemAATWMutation$variables,
|};
*/

var node/*: ConcreteRequest*/ = (function(){
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
    "name": "DashboardSpotlightItemAATWMutation",
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
    "name": "DashboardSpotlightItemAATWMutation",
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
    "cacheID": "d50cde7e1664b28f98fece79a8938d3a",
    "id": null,
    "metadata": {},
    "name": "DashboardSpotlightItemAATWMutation",
    "operationKind": "mutation",
    "text": "mutation DashboardSpotlightItemAATWMutation(\n  $input: AddAssetToWatchlistInput!\n) {\n  addAssetToWatchlist(input: $input) {\n    addedAsset {\n      isInWatchlist\n      id\n    }\n  }\n}\n"
  }
};
})();

(node/*: any*/).hash = "aa2dd9d7534a6bc06d68712b35a70552";

module.exports = ((node/*: any*/)/*: Mutation<
  DashboardSpotlightItemAATWMutation$variables,
  DashboardSpotlightItemAATWMutation$data,
>*/);
