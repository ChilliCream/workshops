/**
 * @generated SignedSource<<15df7b8fa3fd9ffaa2a9d7c02fcce998>>
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

node.hash = "8100c9379a13b8b002da3186b76f05d6";

module.exports = node;
