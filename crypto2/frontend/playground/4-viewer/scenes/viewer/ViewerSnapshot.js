import {Stack} from '@mui/material';
import {memo, useCallback, useMemo, useState, useTransition} from 'react';
import {
  graphql,
  useFragment,
  useRefetchableFragment,
  useSubscription,
} from 'react-relay';

import {BigChart, Change, SlotRollingPrice, SpanSelector} from '@/components';

export default memo(function ViewerSnapshot({fragmentRef}) {
  const asset = useFragment(
    graphql`
      fragment ViewerSnapshotFragment_asset on Asset {
        symbol
        color
        price {
          ...ViewerSnapshotFragment_price
        }
      }
    `,
    fragmentRef,
  );
  const [price, refetch] = useRefetchableFragment(
    graphql`
      fragment ViewerSnapshotFragment_price on AssetPrice
      @argumentDefinitions(span: {type: "ChangeSpan", defaultValue: DAY})
      @refetchable(queryName: "ViewerSnapshotRefetchableQuery") {
        currency
        lastPrice
        change(span: $span) {
          percentageChange
          history {
            nodes {
              epoch
              price
            }
          }
        }
      }
    `,
    asset.price,
  );

  const [span, setSpan] = useState('DAY');
  const [busy, startTransition] = useTransition();

  const handleSpanChange = useCallback((_event, value) => {
    startTransition(() => {
      setSpan(value);
      refetch({span: value});
    });
  }, []);

  useSubscription(
    useMemo(
      () => ({
        subscription: graphql`
          subscription ViewerSnapshotSubscription(
            $symbol: String!
            $span: ChangeSpan!
          ) {
            onPriceChange(symbols: [$symbol]) {
              currency
              lastPrice
              change(span: $span) {
                percentageChange
              }
            }
          }
        `,
        variables: {symbol: asset.symbol, span},
      }),
      [asset.symbol, span],
    ),
  );

  return (
    <Stack justifyContent="center" alignItems="center" gap={2}>
      <Stack direction="row" gap={2}>
        <SlotRollingPrice
          key={asset.symbol}
          value={price.lastPrice}
          options={{currency: price.currency}}
        />
        <Change value={price.change.percentageChange} />
      </Stack>
      <SpanSelector span={span} busy={busy} onChange={handleSpanChange} />
      <BigChart
        color={asset.color}
        currency={price.currency}
        span={span}
        data={price.change.history.nodes}
      />
    </Stack>
  );
});
