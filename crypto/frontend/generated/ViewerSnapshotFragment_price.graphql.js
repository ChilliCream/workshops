/**
 * @generated SignedSource<<d9367474dd8652fe6bfe3ef084f66729>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type ViewerSnapshotFragment_price$fragmentType: FragmentType;
import type { ViewerSnapshotRefetchableQuery$variables } from "./ViewerSnapshotRefetchableQuery.graphql";
export type ViewerSnapshotFragment_price$data = {|
  +change: ?{|
    +history: ?{|
      +nodes: ?$ReadOnlyArray<?{|
        +epoch: number,
        +price: number,
      |}>,
    |},
    +percentageChange: number,
  |},
  +currency: string,
  +id: string,
  +lastPrice: number,
  +$fragmentType: ViewerSnapshotFragment_price$fragmentType,
|};
export type ViewerSnapshotFragment_price$key = {
  +$data?: ViewerSnapshotFragment_price$data,
  +$fragmentSpreads: ViewerSnapshotFragment_price$fragmentType,
  ...
};
*/

import ViewerSnapshotRefetchableQuery_graphql from './ViewerSnapshotRefetchableQuery.graphql';
var node/*: ReaderFragment*/ = {
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
      "operation": ViewerSnapshotRefetchableQuery_graphql,
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

(node/*: any*/).hash = "92f04f73a86ad17b385a146cb370f432";

export default node;
