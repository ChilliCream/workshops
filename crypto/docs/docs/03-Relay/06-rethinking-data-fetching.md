# Rethinking Data Fetching

React breaks complex interfaces into reusable components, allowing developers to reason about discrete units of an application in isolation, and reducing the coupling between disparate parts of an application.

In general, the overwhelming majority of products want one specific behavior: fetch all the data for a view hierarchy while displaying a loading indicator, and then render the entire view once the data is available.

One solution (let's call it "top-down") is to have a root component declare and fetch the data required by it and all of its children. However, this would introduce coupling: any change to a child component would require changing any root component that might render it! Soon it becomes very difficult to mantain, because it requires to keep track of the fields needed and properly remove that not used anymore.

Another logical approach is to have each component declare and fetch the data it requires. This sounds great. However, the problem is that a component may render different children based on the data it received. So, nested components will be unable to render and begin fetching their data until parent components' queries have completed. In other words, _this forces data fetching to proceed in stages_ (let's call it "waterfall"). Rendering would require multiple slow, serial roundtrips.

Relay allows components to specify what data they require, but to coalesce those requirements into a single query that fetches the data for an entire subtree of components. In other words, it determines statically (i.e. before your application runs; at the time you write your code) the requirements for an entire view!

## Specifying the data requirements of a component

With Relay, the data requirements for a component are specified with [fragments](https://relay.dev/docs/guided-tour/rendering/fragments/). Fragments are named snippets of GraphQL that specify which fields to select from an object of a particular type. Fragments are written within GraphQL literals. This data is then read out from the store by calling the `useFragment` hook in a functional React component.
The second parameter (`fragmentRef`) is a fragment reference are obtained by spreading a fragment into another fragment or query.

Fragments cannot be fetched by themselves; instead, they must ultimately be included in a parent query. The Relay compiler will then ensure that the data dependencies declared in such fragments are fetched as part of that parent query.

```jsx title="@/scenes/dashboard/DashboardTickerItem.js"
export default memo(function DashboardTickerItem({fragmentRef}) {
  const asset = useFragment(
    graphql`
      fragment DashboardTickerItemFragment_asset on Asset {
        symbol
        color
        price {
          currency
          lastPrice
          change24Hour
        }
      }
    `,
    fragmentRef,
  );

  // ...
});
```

:::note

Relay uses `Fragments` to declare data requirements for components, and compose data requirements together.

:::

## Lazily Fetching Queries

To fetch a query lazily, you can use the `useLazyLoadQuery` hook:

```jsx title="@/scenes/dashboard/DashboardTicker.js"
import {memo} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {Ticker} from '@/components';

import DashboardTickerItem from './DashboardTickerItem';

export default memo(function DashboardTicker() {
  const data = useLazyLoadQuery(
    graphql`
      query DashboardTickerQuery {
        assets(first: 10) {
          nodes {
            symbol
            ...DashboardTickerItemFragment_asset
          }
        }
      }
    `,
    {},
  );
  const assets = data.ticker?.nodes;

  return (
    <Ticker>
      {assets?.map((asset) => (
        <DashboardTickerItem key={asset.symbol} fragmentRef={asset} />
      ))}
    </Ticker>
  );
});
```

:::note

The example above is a teaser. Usually we want to have one or a few queries that accumulate all the data required to render the screen.

:::

Here how we can compose fragments at scale:

```jsx title="@/scenes/dashboard/DashboardContainer.js"
import {Divider, Stack} from '@mui/material';
import ErrorPage from 'next/error';
import {memo} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';

import DashboardFeatured from './DashboardFeatured';
import DashboardSpotlight from './DashboardSpotlight';
import DashboardTicker from './DashboardTicker';

export default memo(function DashboardContainer({cacheBuster}) {
  const data = useLazyLoadQuery(
    graphql`
      query DashboardContainerQuery {
        ...DashboardTickerFragment_query
        ...DashboardFeaturedFragment_query
        ...DashboardSpotlightFragment_query @defer(label: "spotlight")
      }
    `,
    {},
    {fetchKey: cacheBuster},
  );

  if (!data) {
    return <ErrorPage statusCode={404} title="Out of service" />;
  }

  return (
    <Stack gap={2}>
      <DashboardTicker fragmentRef={data} />
      <Divider />
      <DashboardFeatured fragmentRef={data} />
      <Divider />
      <DashboardSpotlight fragmentRef={data} />
    </Stack>
  );
});
```

```jsx title="@/scenes/dashboard/DashboardTicker.js"
import {memo} from 'react';
import {graphql, useFragment} from 'react-relay';

import {Ticker} from '@/components';

import DashboardTickerItem from './DashboardTickerItem';

export default memo(function DashboardTicker({fragmentRef}) {
  const data = useFragment(
    graphql`
      fragment DashboardTickerFragment_query on Query {
        ticker: assets(first: 10) {
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

  return (
    <Ticker>
      {assets?.map((asset) => (
        <DashboardTickerItem key={asset.symbol} fragmentRef={asset} />
      ))}
    </Ticker>
  );
});
```

## Data Flow

```text

               ┌───────────────────────┐
               │         Query         │
               └───────────────────────┘
                           │
                           ▼
                                             ┌ ─ ─ ─ ┐
                         fetch ◀────────────▶ Server
                                             └ ─ ─ ─ ┘
                           │
                     ┌─────┴───────┐
                     ▼             ▼
               ┌──────────┐  ┌──────────┐
               │  Query   │  │ Response │
               └──────────┘  └──────────┘
                     │             │
                     └─────┬───────┘
                           │
                           ▼
                       normalize
                           │
                           ▼                      ┌─────────────┐
               ┌───────────────────────┐        ┌─────────────┐ │
               │     RecordSource      │  ───▶  │ Component 1 │─┘
               │                       │        └─────────────┘
               │┌──────┐┌──────┐┌─────┐│        ┌─────────────┐
               ││Record││Record││ ... ││  ───▶  │ Component 2 │─┐
               │└──────┘└──────┘└─────┘│        └─────────────┘ │
               └───────────────────────┘          └─────────────┘
```

1. The query is fetched from the network.

1. The query and response are traversed together, extracting the results into `Record` objects which are added to a fresh `RecordSource`.

1. This fresh `RecordSource` would then be published to the store, that later on will notify any subscribers whose results have changed.

## Data Masking

We've seen that Relay ensures that the data for a view is fetched all at once. But Relay also provide another benefit that isn't immediately obvious: **data masking**.

Relay only allows components to access data they specifically ask for in GraphQL fragments, and nothing more. So if one component queries for `foo`, and another for `bar`, each can see _only_ the field that they asked for. In fact, components can't even see the data requested by their _children_: that would also break encapsulation.

:::info

If we look at the example above, we can get the value for `symbol` because it is explicitly defined within the fragment, but it will not be possible to access to `color` that was defined in the `DashboardTickerItemFragment_asset` fragment.

```jsx title="@/scenes/dashboard/DashboardTicker.js"
// ...
return (
  <Ticker>
    {assets?.map((asset) => (
      <DashboardTickerItem key={asset.symbol} fragmentRef={asset} />
    ))}
  </Ticker>
);
// ...
```

:::

## Refreshing

When referring to "refreshing a query", we mean fetching the exact same data that was originally rendered by the query, in order to get the most up-to-date version of that data from the server.

If we want to keep our data up to date with the latest version from the server, the first thing to consider is if it appropriate to use any real-time features, which can make it easier to automatically keep the data up to date without manually refreshing the data periodically.

One example of this is using [GraphQL Subscriptions](https://relay.dev/docs/guided-tour/updating-data/graphql-subscriptions), which will require additional configuration on your server and [network layer](https://relay.dev/docs/guided-tour/updating-data/graphql-subscriptions/#configuring-the-network-layer).

To refresh a query using the [useLazyLoadQuery](https://relay.dev/docs/api-reference/use-lazy-load-query/) hook, we can use the following options:

- `fetchKey`: A new fetchKey will ensure that the query is fully re-evaluated and refetched.

- `fetchPolicy`: to ensure that we always fetch from the network and skip the local data cache.

```jsx title="@/scenes/Greetings.js"
import {graphql, useLazyLoadQuery} from 'react-relay';

export default function Greetings({name, fetchOptions}) {
  const data = useLazyLoadQuery(
    graphql`
      query GreetingsQuery @argumentDefinitions(name: {type: "String"}) {
        greetings(name: $name)
      }
    `,
    {name},
    fetchOptions,
  );

  return <div>{data.greetings}</div>;
}
```

Now we are able to force a query refresh:

```jsx
const [fetchOptions, setOptions] = useState(null);

// ...

<>
  <button
    onClick={() => {
      setOptions((prev) => ({
        fetchKey: (prev?.fetchKey ?? 0) + 1,
        fetchPolicy: 'network-only',
      }));
    }}
  >
    refresh
  </button>

  <Greetings name="Luke" fetchOptions={fetchOptions} />
</>;
```

## Refetching

When referring to "refetching a query", we mean fetching the query again for different data than was originally rendered by the query. For example, this might be to change a currently selected item, to render a different list of items than the one being shown, or more generally to transition the currently rendered content to show new or different content.

```jsx
const [name, setName] = useState(null);

// ...

<>
  <button
    onClick={() => {
      setName('Luke');
    }}
  >
    Luke
  </button>
  <button
    onClick={() => {
      setName(John');
    }}
  >
    John
  </button>

  <Greetings name={name} />
</>;
```

## Improving Latency with @defer

One of the disadvantages of GraphQL’s request/response model is that the GraphQL response is not returned to clients until the entire request has finished processing. However, not all requested data may be of equal importance, and in some use cases it may be possible for applications to act on a subset of the requested data. An application can speed up its time-to-interactive if the GraphQL server can send the most important data as soon as it’s ready.

The `@defer` directive can be applied to fragment spreads and inline fragments to allow GraphQL servers to do exactly that by returning multiple payloads from a single GraphQL response.

```jsx title="@/scenes/dashboard/DashboardSpotlight.js"
// ...

const Gainers = ({fragmentRef}) => {
  const data = useFragment(
    graphql`
      fragment DashboardSpotlightGainersFragment_query on Query {
        gainers: assets(
          first: 5
          where: {price: {change24Hour: {gt: 0}}}
          order: {price: {change24Hour: DESC}}
        ) {
          ...DashboardSpotlightCardFragment_asset @defer(label: "gainers")
        }
      }
    `,
    fragmentRef,
  );

  return (
    <DashboardSpotlightCard
      fragmentRef={data.gainers}
      title="Top Gainers"
      avatar={<BullishIcon />}
    />
  );
};
```

When the GraphQL execution engine encounters the `@defer` directive, it will fork execution and begin to resolve those fields asynchronously. While the deferred payload is still being prepared, the client can receive and act on the initial payload. This is most useful when the deferred data is large, expensive to load, or not on the critical path for interactivity.
