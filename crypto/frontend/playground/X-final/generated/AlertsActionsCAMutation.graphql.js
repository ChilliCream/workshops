/**
 * @generated SignedSource<<a4f471b09f6427feb95262f2f5f795c7>>
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
  "name": "hasAlerts",
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 5
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AlertsActionsCAMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateAlertPayload",
        "kind": "LinkedField",
        "name": "createAlert",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Alert",
            "kind": "LinkedField",
            "name": "createdAlert",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "AlertsActionsDAFragment_asset"
                  }
                ],
                "storageKey": null
              }
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
    "name": "AlertsActionsCAMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateAlertPayload",
        "kind": "LinkedField",
        "name": "createAlert",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Alert",
            "kind": "LinkedField",
            "name": "createdAlert",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "symbol",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v3/*: any*/),
                    "concreteType": "AssetAlertsConnection",
                    "kind": "LinkedField",
                    "name": "alerts",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetAlertsEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Alert",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
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
                                "name": "targetPrice",
                                "storageKey": null
                              },
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
                                "kind": "ScalarField",
                                "name": "recurring",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "__typename",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "cursor",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "PageInfo",
                        "kind": "LinkedField",
                        "name": "pageInfo",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "endCursor",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "hasNextPage",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "alerts(first:5)"
                  },
                  {
                    "alias": null,
                    "args": (v3/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "AlertsActions_alerts",
                    "kind": "LinkedHandle",
                    "name": "alerts"
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ae6efcfab084afd7c9bf13beac5f68e3",
    "id": null,
    "metadata": {},
    "name": "AlertsActionsCAMutation",
    "operationKind": "mutation",
    "text": "mutation AlertsActionsCAMutation(\n  $input: CreateAlertInput!\n) {\n  createAlert(input: $input) {\n    createdAlert {\n      asset {\n        hasAlerts\n        ...AlertsActionsDAFragment_asset\n        id\n      }\n      id\n    }\n  }\n}\n\nfragment AlertsActionsDAFragment_asset on Asset {\n  symbol\n  alerts(first: 5) {\n    edges {\n      node {\n        id\n        currency\n        targetPrice\n        percentageChange\n        recurring\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

node.hash = "1c14bb5368ffbed4a19dfeb3369343a5";

module.exports = node;
