/**
 * @generated SignedSource<<f6e951db134ffe8de227d0a57b2c9753>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type AlertsActionsDAFragment_asset$fragmentType: FragmentType;
import type { AlertsActionRefetchableField$variables } from "./AlertsActionRefetchableField.graphql";
export type AlertsActionsDAFragment_asset$data = {|
  +alerts: ?{|
    +edges: ?$ReadOnlyArray<{|
      +node: {|
        +currency: string,
        +id: string,
        +percentageChange: number,
        +recurring: boolean,
        +targetPrice: number,
      |},
    |}>,
  |},
  +id: string,
  +symbol: string,
  +$fragmentType: AlertsActionsDAFragment_asset$fragmentType,
|};
export type AlertsActionsDAFragment_asset$key = {
  +$data?: AlertsActionsDAFragment_asset$data,
  +$fragmentSpreads: AlertsActionsDAFragment_asset$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = (function(){
var v0 = [
  "alerts"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": 5,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": require('./AlertsActionRefetchableField.graphql'),
      "identifierField": "id"
    }
  },
  "name": "AlertsActionsDAFragment_asset",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "symbol",
      "storageKey": null
    },
    {
      "alias": "alerts",
      "args": null,
      "concreteType": "AssetAlertsConnection",
      "kind": "LinkedField",
      "name": "__AlertsActions_alerts_connection",
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
                (v1/*: any*/),
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
      "storageKey": null
    },
    (v1/*: any*/)
  ],
  "type": "Asset",
  "abstractKey": null
};
})();

(node/*: any*/).hash = "eeec6c3f051685710bfb7c6fe8035155";

module.exports = ((node/*: any*/)/*: RefetchableFragment<
  AlertsActionsDAFragment_asset$fragmentType,
  AlertsActionsDAFragment_asset$data,
  AlertsActionRefetchableField$variables,
>*/);
