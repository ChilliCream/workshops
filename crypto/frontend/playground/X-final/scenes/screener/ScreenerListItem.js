import {TableCell, TableRow} from '@mui/material';
import {memo, useCallback} from 'react';
import {graphql, useFragment, useMutation} from 'react-relay';

import {Change, Currency, MarketCap, Price, WatchCheckbox} from '@/components';

const useAddToWatchlist = () => {
  const [commit, isInFlight] = useMutation(graphql`
    mutation ScreenerListItemAATWMutation($input: AddAssetToWatchlistInput!) {
      addAssetToWatchlist(input: $input) {
        addedAsset {
          isInWatchlist
        }
      }
    }
  `);

  const execute = useCallback(
    ({id, symbol}) => {
      commit({
        variables: {input: {symbol}},
        optimisticUpdater(store) {
          store.get(id)?.setValue(true, 'isInWatchlist');
        },
        updater(store) {
          store
            .getRoot()
            .getLinkedRecord('me')
            ?.getLinkedRecord('watchlist')
            ?.invalidateRecord();
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

const useRemoveFromWatchlist = () => {
  const [commit, isInFlight] = useMutation(graphql`
    mutation ScreenerListItemRAFWMutation(
      $input: RemoveAssetFromWatchlistInput!
    ) {
      removeAssetFromWatchlist(input: $input) {
        removedAsset {
          isInWatchlist
        }
      }
    }
  `);

  const execute = useCallback(
    ({id, symbol}) => {
      commit({
        variables: {input: {symbol}},
        optimisticUpdater(store) {
          store.get(id)?.setValue(false, 'isInWatchlist');
        },
        updater(store) {
          store
            .getRoot()
            .getLinkedRecord('me')
            ?.getLinkedRecord('watchlist')
            ?.invalidateRecord();
        },
        onCompleted() {
          console.log(`${symbol} was removed from the watchlist`);
        },
        onError() {
          console.log(
            `there was a problem with ${symbol} while removing from the watchlist`,
          );
        },
      });
    },
    [commit],
  );

  return [execute, isInFlight];
};

export default memo(function ScreenerListItem({fragmentRef, extended}) {
  const asset = useFragment(
    graphql`
      fragment ScreenerListItemFragment_asset on Asset {
        id
        symbol
        name
        imageUrl
        isInWatchlist
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
  const {price} = asset;

  const [addToWatchlist] = useAddToWatchlist();
  const [removeFromWatchlist] = useRemoveFromWatchlist();

  return (
    <TableRow
      key={asset.symbol}
      role="checkbox"
      aria-checked={!!asset.isInWatchlist}
      tabIndex={-1}
      hover
    >
      <TableCell component="th" scope="row" sx={{width: 'auto'}}>
        <Currency
          symbol={asset.symbol}
          name={asset.name}
          imageUrl={asset.imageUrl}
        />
      </TableCell>
      <TableCell align="right" sx={{width: 100, paddingLeft: 0}}>
        {price && (
          <Price
            value={price.lastPrice}
            options={{
              currency: price.currency,
            }}
            size="small"
          />
        )}
      </TableCell>
      <TableCell align="right" sx={{width: 70, paddingLeft: 0}}>
        {price && <Change value={price.change24Hour} size="small" />}
      </TableCell>
      {extended && (
        <TableCell align="right" sx={{width: 70, paddingLeft: 0}}>
          {price && (
            <MarketCap
              value={price.marketCap}
              options={{
                currency: price.currency,
              }}
              size="small"
            />
          )}
        </TableCell>
      )}
      <TableCell align="right" sx={{width: 46, paddingLeft: 0}}>
        <WatchCheckbox
          checked={!!asset.isInWatchlist}
          disabled={asset.isInWatchlist === null}
          size="small"
          onChange={(event) => {
            if (event.target.checked) {
              addToWatchlist(asset);
            } else {
              removeFromWatchlist(asset);
            }
          }}
        />
      </TableCell>
    </TableRow>
  );
});
