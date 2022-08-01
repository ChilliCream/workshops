# On-Demand Data

In GraphQL, data in the server is requested using so-called [GraphQL Queries](https://graphql.org/learn/queries/).

Queries are _read_ server operations, which allow to specify a set of fields that we want to request from the server.

What we can query for will depend on the [GraphQL Schema](https://graphql.org/learn/schema/) exposed on the server, which describes the data that is available for querying.

---

## Rethinking Data Fetching

React breaks complex interfaces into reusable components, allowing developers to reason about discrete units of an application in isolation, and reducing the coupling between disparate parts of an application. Relay’s approach to data-fetching is heavily inspired by React.

In general, the overwhelming majority of products want one specific behavior: fetch all the data for a view hierarchy while displaying a loading indicator, and then render the entire view once the data is available.

One solution is to have a root component declare and fetch the data required by it and all of its children. However, this would introduce coupling: any change to a child component would require changing any root component that might render it! Soon it becomes very difficult to mantain, because it requires to keep track of the fields needed and properly remove that not used anymore.

Another logical approach is to have each component declare and fetch the data it requires. This sounds great. However, the problem is that a component may render different children based on the data it received. So, nested components will be unable to render and begin fetching their data until parent components’ queries have completed. In other words, _this forces data fetching to proceed in stages_: first render the root and fetch the data it needs, then render its children and fetch their data, and so on until you reach leaf components. Rendering would require multiple slow, serial roundtrips.

Relay combines the advantages of both of these approaches by allowing components to specify what data they require, but coalescing those requirements into a single query, therefore a single network request for all of the data required by a view!

It’s all about composition. This is a typical design pattern, we could easily add more components to the view or move our boundaries to create a different UX.

```text
Screener
  ErrorBoundary
    Suspense fallback=ActivityIndicator
      ScreenerContainer
        ScreenerList
          ScreenerListItem
```

You can build top-down or bottom-up. In simpler examples, it’s usually easier to go top-down, and on larger projects, it’s easier to go bottom-up and write tests as you build.

### Specifying the Data Requirements of a Component

With Relay, the data requirements for a component are specified with [fragments](https://relay.dev/docs/guided-tour/rendering/fragments/). Fragments are named snippets of GraphQL that specify which fields to select from an object of a particular type. Fragments are written within GraphQL literals. This data is then read out from the store by calling the `useFragment` hook in a functional React component.

```jsx title="@/scenes/screener/ScreenerListItem.js"
export default memo(function ScreenerListItem({fragmentRef}) {
  const asset = useFragment(
    graphql`
      fragment ScreenerListItemFragment_asset on Asset {
        id
        symbol
        name
        imageUrl
        price {
          currency
          lastPrice
          change24Hour
          marketCap
        }
      }
    `,
    fragmentRef,
  );

  // ...
});
```

The second parameter (`fragmentRef`) is a fragment reference are obtained by spreading a fragment into another fragment or query.

:::note

Use fragments and fragment composition to declare data requirements for components.

:::

### Composing Fragments into Queries

Fragments cannot be fetched by themselves; instead, they must ultimately be included in a query, either directly or transitively. The Relay compiler will then ensure that the data dependencies declared in such fragments are fetched as part of that parent query.

```jsx title="@/scenes/screener/ScreenerList.js"
export default memo(function ScreenerList({fragmentRef}) {
  const data = useFragment(
    graphql`
      ScreenerListFragment_query on Query {
        assets {
          nodes {
            id
            ...ScreenerListItemFragment_asset
          }
        }
      }
    `,
    fragmentRef,
  );
  const assets = data?.nodes;

  return (
    // ...
    assets?.map((asset) => (
      <ScreenerListItem key={asset.id} fragmentRef={asset} />
    ))
    // ...
  );
});
```

To fetch and render a query lazily that includes a fragment, you can use the `useLazyLoadQuery` hook:

```jsx title="@/scenes/screener/ScreenerContainer.js"
export default memo(function ScreenerContainer({cacheBuster}) {
  const data = useLazyLoadQuery(
    graphql`
      query ScreenerContainerQuery {
        ...ScreenerListFragment_query
      }
    `,
    {},
    {fetchKey: cacheBuster},
  );

  return (
    // ...
    <ScreenerList fragmentRef={data} />
    // ...
  );
});
```

```jsx title="@/scenes/screener/index.js"
export const Screener = () => (
  <ErrorBoundaryWithRetry>
    {({cacheBuster}) => (
      <Suspense fallback={<ActivityIndicator />}>
        <ScreenerContainer cacheBuster={cacheBuster} />
      </Suspense>
    )}
  </ErrorBoundaryWithRetry>
);
```

:::caution The example above is a teaser

We’ll learn how to render lists with _cursor-based pagination_.

:::

### Data Masking

We’ve seen that Relay ensures that the data for a view is fetched all at once. But Relay also provide another benefit that isn’t immediately obvious: **data masking**.

Relay only allows components to access data they specifically ask for in GraphQL fragments, and nothing more. So if one component queries for `foo`, and another for `bar`, each can see _only_ the field that they asked for. In fact, components can’t even see the data requested by their _children_: that would also break encapsulation.

:::info

If we look at the example above, we can get the value for `id` because it is explicitly defined within the query, but it’ll not be possible to access to `symbol` or `name` that were defined in the `ScreenerListItemFragment_asset` fragment.

```jsx title="@/scenes/screener/ScreenerList.js"
// ...
return (
  // ...
  assets?.map((asset) => (
    <ScreenerListItem key={asset.id} fragmentRef={asset} />
  ))
  // ...
);
// ...
```

:::

### Data Flow

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

---

## Rendering Lists

Often times we don’t want to query the entire set of data up front, but rather discrete sub-parts of the list, incrementally, usually in response to user input or other events.

### Pagination

Querying a list of data in discrete parts is usually known as [Pagination](https://graphql.org/learn/pagination/).

Specifically in Relay, we do this via GraphQL fields known as [Connections](https://graphql.org/learn/pagination/#complete-connection-model). Connections are GraphQL fields that take a set of arguments to specify which "slice" of the list to query, and include in their response both the "slice" of the list that was requested, as well as information to indicate if there is more data available in the list and how to query it; this additional information can be used in order to perform pagination by querying for more "slices" or pages on the list.

Relay uses directives to add additional information to GraphQL documents, which are used by the Relay compiler to generate the appropriate runtime artifacts. These directives only appear in your application code and are removed from requests sent to your GraphQL server. Among others: `@argumentDefinitions`, `@refetchable`, `@connection`.

To actually perform pagination over the connection, we need use the `loadNext` function to fetch the next page of items, which is available from `usePaginationFragment`:

```jsx title="@/scenes/screener/ScreenerList.js"
// ...
import {graphql, usePaginationFragment} from 'react-relay';
// ...

export default memo(function ScreenerList({fragmentRef}) {
  const {data, hasNext, loadNext, isLoadingNext, refetch} =
    usePaginationFragment(
      graphql`
        fragment ScreenerListFragment_query on Query
        @argumentDefinitions(
          cursor: {type: "String"}
          count: {type: "Int", defaultValue: 10}
        )
        @refetchable(queryName: "ScreenerListRefetchableQuery") {
          assets(after: $cursor, first: $count)
            @connection(key: "ScreenerList_assets") {
            edges {
              node {
                id
                ...ScreenerListItemFragment_asset
              }
            }
          }
        }
      `,
      fragmentRef,
    );

  // ...

  return (
    // ...
    <TransitionIndicator in={busy}>
      {assets?.length || hasNext ? (
        <Table ref={tableRef} size="medium">
          <TableBody>
            {assets.map(({node}) => (
              <ScreenerListItem key={node.id} fragmentRef={node} />
            ))}
          </TableBody>
          {hasNext && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <LoadMoreButton busy={isLoadingNext} onClick={loadNext} />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      ) : (
        <NoData message="Hmm, we can’t find that asset." />
      )}
    </TransitionIndicator>
    // ...
  );
});
```

Let’s distill what’s going on here:

- The component is automatically subscribed to updates to the fragment data: if the data required is updated anywhere in the app (e.g., via fetching new data, mutating existing data), the component will automatically re-render with the latest updated data.
- The component will suspend if any data for that specific fragment is missing, and the data is currently being fetched by a parent query.
- Note that pagination (`loadNext` or `loadPrevious`), will not cause the component to suspend.

:::note

Calling `loadNext` _will not_ cause the component to suspend. Instead, the `isLoadingNext` value will be set to `true` while the request is in flight, and the new items from the pagination request will be added to the connection, causing the component to re-render.

You might use `isLoadingNext` to display some progress indicator.

:::

In the example above, we’ve used a fragment for the pagination, which meeds to be included in a query.

```jsx title="@/scenes/screener/ScreenerContainer.js"
import {Stack} from '@mui/material';
import {memo} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';

import ScreenerList from './ScreenerList';

export default memo(function ScreenerContainer({cacheBuster}) {
  const data = useLazyLoadQuery(
    graphql`
      query ScreenerContainerQuery {
        ...ScreenerListFragment_query
      }
    `,
    {},
    {fetchKey: cacheBuster},
  );

  return (
    <Stack gap={2}>
      <ScreenerList fragmentRef={data} />
    </Stack>
  );
});
```

### Sorting and Filtering

Often times when querying for a list of data, you can provide different values in the query which serve as filters that change the result set, or sort it differently.

Some examples of this are:

- Building a search typeahead, where the list of results is a list filtered by the search term entered by the user.
- Changing the ordering mode of the list, which could produce a completely different list of results from the server.

Specifically, in GraphQL, connection fields can accept arguments to sort or filter the set of queried results:

```graphql
fragment ScreenerListFragment_query on Query {
  assets(where: {symbol: {contains: 'BT'}}, order: {symbol: 'ASC'})
    nodes {
      ...ScreenerListItemFragment_asset
    }
  }
}
```

In Relay, we can pass those arguments using GraphQL [variables](https://relay.dev/docs/guided-tour/rendering/variables/).

```jsx
const {data, hasNext, loadNext, isLoadingNext, refetch} = usePaginationFragment(
  graphql`
    fragment ScreenerListFragment_query on Query
    @argumentDefinitions(
      cursor: {type: "String"}
      count: {type: "Int", defaultValue: 10}
      where: {type: "AssetFilterInput"}
      order: {
        type: "[AssetSortInput!]"
        defaultValue: {price: {marketCap: DESC}}
      }
    )
    @refetchable(queryName: "ScreenerListRefetchableQuery") {
      assets(after: $cursor, first: $count, where: $where, order: $order)
        @connection(key: "ScreenerList_assets") {
        edges {
          node {
            id
            ...ScreenerListItemFragment_asset
          }
        }
      }
    }
  `,
  fragmentRef,
);

// ...

refetch({where: {symbol: {contains: 'BT'}}, order: {symbol: 'ASC'}});
```

:::tip Use the `goto` script as a shortcut

```sh
yarn goto playground/2-screener
```

:::

#### Check It Out

1. Open your browser and visit [http://localhost:3000](http://localhost:3000). You should see the “Screener”.

1. Open the **DevTools** of your browser and select the **Network** panel. Reload the app and look among the resources for the GraphQL request (e.g., filter by `/graphql`). Inspect the details of the resource in different panels.

#### What’s Going On?

- Calling `refetch` and passing a new set of variables will fetch the fragment again _with the newly provided variables_.
- This will re-render your component and may cause it to suspend if it needs to send and wait for a network request.
- Conceptually, when we call `refetch`, we’re fetching the connection _from scratch_. It other words, we’re fetching it again from the _beginning_ and _"resetting"_ our pagination state.

---

## Advanced Rendering

GraphQL provides a powerful tool for building efficient, decoupled client applications. Relay builds on this functionality to provide a framework for **declarative data-fetching**. By separating _what_ data to fetch from _how_ it is fetched, Relay helps developers build applications that are robust, transparent, and performant by default. It’s a great complement to the component-centric way of thinking championed by React.

While each of these technologies — React, Relay, and GraphQL — are powerful on their own, the combination is a **UI platform** that allows us to _move fast and ship high-quality apps at scale_.

### Transitions Are Everywhere

Any component can “suspend” any time if some data it needs is not ready yet. We can strategically place `<Suspense>` boundaries in different parts of the tree to handle this, but it won’t always be enough.

It might be acceptable to display a pending indicator while we load the data for the initial render. However, once we have rendered the UI and the user interacts with it, further updates might come. For a better UX we would like to keep showing the actual data and at the same time some indication of progress to give the feeling that things are going to change until that happens.

Let’s see this in action within the `ScreenerList`. For example, we could be interested to keep rendering the stale data while we refetch it to fulfill the sorting and filtering requirements.

```jsx title="@/scenes/screener/ScreenerList.js"
// ...

const [q, setQ] = useState('');
const qRef = useRef(q);
const deferredQ = useDeferredValue(q);

const [order, setOrder] = useState(0);
const orderRef = useRef(order);

const [busy, startTransition] = useTransition();

useEffect(() => {
  if (qRef.current !== deferredQ || orderRef.current !== order) {
    qRef.current = deferredQ;
    orderRef.current = order;

    startTransition(() => {
      const variables = Object.assign(
        {},
        !!deferredQ && {
          where: {
            or: [
              {symbol: {contains: deferredQ}},
              {name: {contains: deferredQ}},
              {slug: {contains: deferredQ}},
            ],
          },
        },
        !!order && {order: Order[order].expression},
      );

      refetch(variables);
    });
  }
}, [deferredQ, order]);

// ...
<TransitionIndicator in={busy}>
  {
    // ...
  }
</TransitionIndicator>;
```

Furthermore, we used `useDeferredValue` which accepts a value and returns a new copy of the value that will defer to more urgent updates. If the current render is the result of an urgent update, like user input, React will return the previous value and then render the new value after the urgent render has completed.

:::tip Use the `goto` script as a shortcut

```sh
yarn goto playground/2-screener
```

:::

#### Check It Out

1. Open your browser and visit [http://localhost:3000](http://localhost:3000). You should see the “Screener”.

1. Open the **DevTools** of your browser and select the **Network** panel. Reload the app and look among the resources for the GraphQL request (e.g., filter by `/graphql`). Inspect the details of the resource in different panels.

1. Fake the latency of the responses in `@client/index.js` by uncommenting `pause` for responses. Play with the search and sorting and you’ll appreciate how transitions create a better UX.

#### What’s Going On?

- Using transitions we keep rendering the stale data while loading updates.
- Using `useDeferredValue` we prioritize rendering (e.g., typing in an input) over other expensive work that could lead to sluggish interaction.

### Composing at Scale

Usually we want to have one or a few queries that accumulate all the data required to render the screen.

One of the disadvantages of GraphQL’s request/response model is that the GraphQL response is not returned to clients until the entire request has finished processing. However, not all requested data may be of equal importance, and in some use cases it may be possible for applications to act on a subset of the requested data. An application can speed up its time-to-interactive if the GraphQL server can send the most important data as soon as it’s ready.

The `@defer` directive can be applied to fragment spreads and inline fragments to allow GraphQL servers to do exactly that by returning multiple payloads from a single GraphQL response.

Imagine that we request market information for our currencies that is provided by a third party service with a significant delay. We could give to the GraphQL service a “hint” to deliver us everything except that asap, and later on such part.

It’ll look something like this:

```graphql
fragment ScreenerListItemFragment_asset on Asset {
  id
  symbol
  name
  # ...
  ...MarketNewsFragment_asset @defer(label: "news")
}
```

When the GraphQL execution engine encounters the `@defer` directive, it’ll fork execution and begin to resolve those fields asynchronously. While the deferred payload is still being prepared, the client can receive and act on the initial payload. This is most useful when the deferred data is large, expensive to load, or not on the critical path for interactivity.

`SuspenseList` helps coordinate many components that can suspend by orchestrating the order in which these components are revealed to the user.

When multiple components need to fetch data, this data may arrive in an unpredictable order. However, if you wrap these items in a `SuspenseList`, React will not show an item in the list until previous items have been displayed (this behavior is adjustable).

Let’s see this in action within the `Dashboard`. For example, we could be interested to render the UI asap, and therefore we want to deprioritize the `Spotlight` containing Gainers & Losers.

```jsx title="@/scenes/dashboard/DashboardSpotlight.js"
// ...

export default memo(function DashboardSpotlight({fragmentRef}) {
  const data = useFragment(
    graphql`
      fragment DashboardSpotlightFragment_query on Query {
        ...DashboardSpotlightGainersFragment_query @defer(label: "gainers")
        ...DashboardSpotlightLosersFragment_query @defer(label: "losers")
      }
    `,
    fragmentRef,
  );

  return (
    <SuspenseList revealOrder="forwards" tail="collapsed">
      <Suspense fallback={false}>
        <Gainers fragmentRef={data} />
      </Suspense>
      <Divider />
      <Suspense fallback={false}>
        <Losers fragmentRef={data} />
      </Suspense>
    </SuspenseList>
  );
});
```

:::tip Use the `goto` script as a shortcut

```sh
yarn goto playground/3-dashboard
```

:::

#### Check It Out

1. Open your browser and visit [http://localhost:3000](http://localhost:3000). You should see the “Dashboard”.

1. Open the **DevTools** of your browser and select the **Network** panel. Reload the app and look among the resources for the GraphQL request (e.g., filter by `/graphql`). Inspect the details of the resource in different panels.

1. Fake the latency of the responses in `@client/index.js` by uncommenting `pause` for chunked responses. Refresh the browser and you’ll appreciate how the progessive rendering creates a better UX.

#### What’s Going On?

- `SuspenseList` will honour the `revealOrder="forwards"` and render each suspendable component asap but keeping the required order, first `Gainers` then `Losers`, no matter in which order the data is delivered by the GraphQL server.
- Using `tail="collapsed"` will display only the next loading state. In this case, our `Divider` will only render once `Gainers` have been rendered. This could be useful if each `<Suspense>` boundary has a pending indicator as a fallback, instead of rendering many of them at the same time, we restrict it to just the following.

---
