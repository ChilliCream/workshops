# Subscriptions

GraphQL Subscriptions (GQLS) are a mechanism which allow clients to subscribe to changes in a piece of data from the server, and get notified whenever that data changes.

## Writing Subscriptions

A GraphQL Subscription looks very similar to a query, with the exception that it uses the subscription keyword:

```graphql
subscription DashboardTickerSubscription($symbols: [String!]!) {
  onPriceChange(symbols: $symbols) {
    currency
    lastPrice
    change24Hour
  }
}
```

In order to execute a subscription against the server in Relay, we can use the `requestSubscription` and `useSubscription` APIs. Let's take a look at an example using the [useSubscription](https://relay.dev/docs/api-reference/use-subscription/) hook:

```jsx title="@/scenes/dashboard/DashboardTicker.js"
import {memo, useMemo} from 'react';
import {graphql, useFragment, useSubscription} from 'react-relay';

import {Ticker} from '@/components';

import DashboardTickerItem from './DashboardTickerItem';

export default memo(function DashboardTicker({fragmentRef}) {
  const data = useFragment(
    graphql`
      fragment DashboardTickerFragment_query on Query {
        ticker: assets(
          first: 10
          order: {price: {tradableMarketCapRank: ASC}}
        ) {
          nodes {
            symbol
            ...DashboardTickerItemFragment_asset
          }
        }
      }
    `,
    fragmentRef,
  );
  const assets = data.ticker?.nodes;

  useSubscription(
    useMemo(
      () => ({
        subscription: graphql`
          subscription DashboardTickerSubscription($symbols: [String!]!) {
            onPriceChange(symbols: $symbols) {
              currency
              lastPrice
              change24Hour
            }
          }
        `,
        variables: {symbols: assets?.map(({symbol}) => symbol) ?? []},
      }),
      [assets],
    ),
  );

  return (
    <Ticker>
      {assets?.map((asset) => (
        <DashboardTickerItem key={asset.symbol} fragmentRef={asset} />
      ))}
    </Ticker>
  );
});
```

We pass into the hook the following arguments:

- `config`: a config of type [GraphQLSubscriptionConfig](https://relay.dev/docs/api-reference/use-subscription/#type-graphqlsubscriptionconfigtsubscriptionpayload).

- `requestSubscriptionFn`: An optional function with the same signature as [requestSubscription](https://relay.dev/docs/api-reference/request-subscription/), which will be called in its stead. Defaults to `requestSubscription`.

Behavior, it will:

- Subscribe when the component is mounted with the given config.

- Unsubscribe when the component is unmounted.

- Unsubscribe and resubscribe with new values if the environment, config or `requestSubscriptionFn` changes.
