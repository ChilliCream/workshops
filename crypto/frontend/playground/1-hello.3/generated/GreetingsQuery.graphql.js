/**
 * @generated SignedSource<<c8a3e7085ae35da7c834bf2d0ca866b5>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, Query } from 'relay-runtime';
export type GreetingsQuery$variables = {|
  name: string,
|};
export type GreetingsQuery$data = {|
  +greetings: string,
|};
export type GreetingsQuery = {|
  response: GreetingsQuery$data,
  variables: GreetingsQuery$variables,
|};
*/

var node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      }
    ],
    "kind": "ScalarField",
    "name": "greetings",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GreetingsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GreetingsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "df17284c16608f10e79c40f215176912",
    "id": null,
    "metadata": {},
    "name": "GreetingsQuery",
    "operationKind": "query",
    "text": "query GreetingsQuery(\n  $name: String!\n) {\n  greetings(name: $name)\n}\n"
  }
};
})();

(node/*: any*/).hash = "8100c9379a13b8b002da3186b76f05d6";

module.exports = ((node/*: any*/)/*: Query<
  GreetingsQuery$variables,
  GreetingsQuery$data,
>*/);
