/**
 * @generated SignedSource<<a5900310894a5ea664231c8d7667c648>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, Query } from 'relay-runtime';
import type { SettingsProfileFragment_query$fragmentType } from "./SettingsProfileFragment_query.graphql";
export type SettingsContainerQuery$variables = {||};
export type SettingsContainerQuery$data = {|
  +me: ?{|
    +id: string,
  |},
  +$fragmentSpreads: SettingsProfileFragment_query$fragmentType,
|};
export type SettingsContainerQuery = {|
  response: SettingsContainerQuery$data,
  variables: SettingsContainerQuery$variables,
|};
*/

var node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SettingsContainerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      },
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "SettingsProfileFragment_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SettingsContainerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "b092f9bcf1ec1fa19a620ae4f0b16b22",
    "id": null,
    "metadata": {},
    "name": "SettingsContainerQuery",
    "operationKind": "query",
    "text": "query SettingsContainerQuery {\n  me {\n    id\n  }\n  ...SettingsProfileFragment_query\n}\n\nfragment SettingsProfileFragment_query on Query {\n  me {\n    id\n    name\n    displayName\n    imageUrl\n  }\n}\n"
  }
};
})();

(node/*: any*/).hash = "20fcbc8036d965f99cb30e386edd7814";

export default node;
