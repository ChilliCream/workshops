import styled from '@emotion/native';
import React, {
  memo,
  useCallback,
  useMemo,
  useState,
  useTransition,
} from 'react';
import {View} from 'react-native';
import {
  graphql,
  useFragment,
  useRefetchableFragment,
  useSubscription,
} from 'react-relay';

import type {
  ChangeSpan,
  ViewerSnapshotRefetchableQuery,
} from '@/__generated__/ViewerSnapshotRefetchableQuery.graphql';
import type {viewerSnapshotFragment_asset$key} from '@/__generated__/viewerSnapshotFragment_asset.graphql';
import type {viewerSnapshotFragment_price$key} from '@/__generated__/viewerSnapshotFragment_price.graphql';
import {BigChart, Typography} from '@/components';
import {SpanSelector} from '@/components/core/span-selector';
import {formatPercent} from '@/utils';

// import {formatCurrencyToParts} from '@/utils';

type ViewerSnapshotAssetDataProp = viewerSnapshotFragment_asset$key;
type ViewerSnapshotPriceDataProp = viewerSnapshotFragment_price$key;

interface ViewerSnapshotProps {
  fragmentRef: ViewerSnapshotAssetDataProp;
}

const Root = styled(View)`
  margin-top: 16px;
  align-items: center;
`;

const Stack = styled(View)<{
  layout: 'row' | 'column';
  space?: {top?: number; right?: number; bottom?: number; left?: number};
}>`
  flex-direction: ${({layout}) => layout};

  ${({space}) =>
    !!space &&
    Object.entries(space).map(([pos, val]) => `margin-${pos}: ${val}px;`)}
`;

export const ViewerSnapshot = memo<ViewerSnapshotProps>(
  function ViewerSnapshot({fragmentRef}) {
    const [span, setSpan] = useState<ChangeSpan>('DAY');
    const [busy, startTransition] = useTransition();

    const asset = useFragment<ViewerSnapshotAssetDataProp>(
      graphql`
        fragment viewerSnapshotFragment_asset on Asset {
          symbol
          color
          price {
            ...viewerSnapshotFragment_price
          }
        }
      `,
      fragmentRef,
    );

    const [price, refetch] = useRefetchableFragment<
      ViewerSnapshotRefetchableQuery,
      ViewerSnapshotPriceDataProp
    >(
      graphql`
        fragment viewerSnapshotFragment_price on AssetPrice
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

    const handleSpanChange = useCallback((value: ChangeSpan) => {
      startTransition(() => {
        setSpan(value);
        refetch({span: value});
      });
    }, []);

    useSubscription(
      useMemo(
        () => ({
          subscription: graphql`
            subscription viewerSnapshotSubscription(
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

    if (!price.change?.history?.nodes?.length) {
      return null;
    }

    return (
      <Root>
        <Stack layout="row">
          {/* {formatCurrencyToParts(price.lastPrice, {
            currency: price.currency,
          }).map((item, index) =>
            item.type === 'currency' ? (
              <Typography key={`${item.value}:${index}`} variant="subtitle">
                {item.value}
              </Typography>
            ) : null,
          )} */}
          <Typography variant="subtitle">$</Typography>
          <Typography variant="title">{price.lastPrice}</Typography>
          <Typography variant="caption">
            {formatPercent(price.change.percentageChange)}
          </Typography>
        </Stack>

        <SpanSelector onChange={handleSpanChange} span={span} busy={busy} />

        <BigChart
          color={asset.color}
          data={price.change.history.nodes}
          span={span}
        />
      </Root>
    );
  },
);
