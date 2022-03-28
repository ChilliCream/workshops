# Pagination

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

## Behavior

- The component is automatically subscribed to updates to the fragment data: if the data required is updated anywhere in the app (e.g. via fetching new data, or mutating existing data), the component will automatically re-render with the latest updated data.

- The component will suspend if any data for that specific fragment is missing, and the data is currently being fetched by a parent query.

- Note that pagination (`loadNext` or `loadPrevious`), will not cause the component to suspend.

:::note

Calling `loadNext` _will not_ cause the component to suspend. Instead, the `isLoadingNext` value will be set to `true` while the request is in flight, and the new items from the pagination request will be added to the connection, causing the component to re-render.

You might use `isLoadingNext` to display some progress indicator.

:::
