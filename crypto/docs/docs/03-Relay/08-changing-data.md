# Changing Data

In GraphQL, data in the server is updated using so-called [GraphQL Mutations](https://graphql.org/learn/queries/#mutations). Mutations are _read-write_ server operations, which both modify data on the backend, and allow querying for the modified data from the server in the same request.

There generally are three kinds of mutations:

- creating new data
- updating existing data
- deleting existing data

## Writing Mutations

A GraphQL mutation looks very similar to a query, with the exception that it uses the `mutation` keyword:

```graphql
mutation ViewerHeaderAATWMutation($input: AddAssetToWatchlistInput!) {
  addAssetToWatchlist(input: $input) {
    watchlist {
      assets {
        nodes {
          isInWatchlist
        }
      }
    }
  }
}
```

In order to execute a mutation against the server in Relay, we can use the `commitMutation` and `useMutation` APIs. Let's take a look at an example using the [useMutation](https://relay.dev/docs/api-reference/use-mutation/) hook:

```jsx title="@/scenes/viewer/ViewerHeader.js"
// ...
import {memo, useCallback} from 'react';
import {graphql, useFragment, useMutation} from 'react-relay';

const useAddToWatchlist = () => {
  const [commit, isInFlight] = useMutation(graphql`
    mutation ViewerHeaderAATWMutation($input: AddAssetToWatchlistInput!) {
      addAssetToWatchlist(input: $input) {
        watchlist {
          assets {
            nodes {
              isInWatchlist
            }
          }
        }
      }
    }
  `);

  const execute = useCallback(
    ({id, symbol}) => {
      commit({
        variables: {input: {symbol}},
        optimisticUpdater(store) {
          const record = store.get(id);

          record.setValue(true, 'isInWatchlist');
        },
        onCompleted() {
          console.log(`${symbol} was added to the watchlist`);
        },
        onError() {
          console.log(
            `there was a problem with ${symbol} while adding to the watchlist`,
          );
        },
      });
    },
    [commit],
  );

  return [execute, isInFlight];
};

// ...

export default memo(function ViewerHeader({fragmentRef}) {
  const asset = useFragment(
    graphql`
      fragment ViewerHeaderFragment_asset on Asset {
        id
        symbol
        name
        imageUrl
        isInWatchlist
        hasAlerts
      }
    `,
    fragmentRef,
  );

  const [addToWatchlist] = useAddToWatchlist();
  const [removeFromWatchlist] = useRemoveFromWatchlist();

  // ...

  return (
    <Checkbox
      color="primary"
      icon={<WatchIcon />}
      checkedIcon={<WatchedIcon />}
      checked={!!asset.isInWatchlist}
      disabled={asset.isInWatchlist === null}
      inputProps={{
        'aria-label': 'watch',
      }}
      onChange={(event) => {
        if (event.target.checked) {
          addToWatchlist(asset);
        } else {
          removeFromWatchlist(asset);
        }
      }}
    />
  );
});
```

We pass into the hook the following arguments:

- `mutation`: GraphQL mutation specified using a `graphql` template literal.

- `commitMutationFn`: An optional function with the same signature as [commitMutation](https://relay.dev/docs/api-reference/commit-mutation/), which will be called in its stead. Defaults to `commitMutation`.

And it returns:

- `commitMutation`: The function that will execute the mutation.

- `areMutationsInFlight`: Will be `true` if any mutation triggered by calling `commitMutation` is still in flight. If you call `commitMutation` multiple times, there can be multiple mutations in flight at once.

:::info

There are several ways to implement `optimistic` updates, to provide a better UX. In the example above, we have used `optimisticUpdater`: a function used to optimistically update the local in-memory store, i.e. immediately, before the mutation request has completed. If an error occurs during the mutation request, the optimistic update will be rolled back.

:::
