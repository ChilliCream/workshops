# List Data

There are several scenarios in which we'll want to query a list of data from the GraphQL server.

## Pagination

Often times we don't want to query the entire set of data up front, but rather discrete sub-parts of the list, incrementally, usually in response to user input or other events. Querying a list of data in discrete parts is usually known as [Pagination](https://graphql.org/learn/pagination/).

Specifically in Relay, we do this via GraphQL fields known as [Connections](https://graphql.org/learn/pagination/#complete-connection-model). Connections are GraphQL fields that take a set of arguments to specify which "slice" of the list to query, and include in their response both the "slice" of the list that was requested, as well as information to indicate if there is more data available in the list and how to query it; this additional information can be used in order to perform pagination by querying for more "slices" or pages on the list.

You can use `usePaginationFragment` to render a fragment that uses a `@connection` and paginate over it:

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

  {
    assets?.length || hasNext ? (
      <TransitionIndicator in={busy}>
        <Table ref={tableRef} size="medium">
          <TableBody>
            {assets.map(({node}) => (
              <ScreenerListItem
                key={node.id}
                fragmentRef={node}
                extended={extended}
              />
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
      </TransitionIndicator>
    ) : (
      <NoData message="Hmm, we can't find that asset." />
    );
  }

  // ...
});
```

Let's distill what's going on here:

- The component is automatically subscribed to updates to the fragment data: if the data required is updated anywhere in the app (e.g. via fetching new data, or mutating existing data), the component will automatically re-render with the latest updated data.

- The component will suspend if any data for that specific fragment is missing, and the data is currently being fetched by a parent query.

- Note that pagination (`loadNext` or `loadPrevious`), will not cause the component to suspend.

:::note

Calling `loadNext` _will not_ cause the component to suspend. Instead, the `isLoadingNext` value will be set to `true` while the request is in flight, and the new items from the pagination request will be added to the connection, causing the component to re-render.

You might use `isLoadingNext` to display some progress indicator.

:::

## Sorting and Filtering

Often times when querying for a list of data, you can provide different values in the query which serve as filters that change the result set, or sort it differently.

Some examples of this are:

- Building a search typeahead, where the list of results is a list filtered by the search term entered by the user.

- Changing the ordering mode of the list, which could produce a completely different list of results from the server.

Specifically, in GraphQL, connection fields can accept arguments to sort or filter the set of queried results:

```graphql
fragment ScreenerListFragment_query on Query {
  assets(where: {symbol: {contains: 'BT'}}, order: {symbol: 'ASC'})
    edges {
      node {
        id
        ...ScreenerListItemFragment_asset
      }
    }
  }
}
```

In Relay, we can pass those arguments as usual using GraphQL [variables](https://relay.dev/docs/guided-tour/rendering/variables/).

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

Let's distill what's going on here:

- Calling `refetch` and passing a new set of variables will fetch the fragment again _with the newly provided variables_.

- This will re-render your component and may cause it to suspend if it needs to send and wait for a network request.

- Conceptually, when we call `refetch`, we're fetching the connection _from scratch_. It other words, we're fetching it again from the _beginning_ and _"resetting"_ our pagination state.

:::note Transitions and Updates that Suspend

`Suspense` boundary fallbacks allow us to describe our loading placeholders when initially rendering some content, but our applications will also have transitions between different content.

React, when concurrent rendering is supported, provides an option to avoid hiding already rendered content with a `Suspense` fallback when suspending.

For more information, read the docs [here](https://reactjs.org/docs/hooks-reference.html#usetransition).

:::
