import styled from '@emotion/native';
import React, {memo} from 'react';
import {View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import type {viewerStatsFragment_asset$key} from '@/__generated__/viewerStatsFragment_asset.graphql';
import {Typography} from '@/components';
import {formatDecimalUnitUsingCompactNotation} from '@/utils';

type ViewerStatsDataProp = viewerStatsFragment_asset$key;

interface ViewerStatsProps {
  fragmentRef: ViewerStatsDataProp;
}

const Stack = styled(View)<{
  layout: 'row' | 'column';
  space?: {top?: number; right?: number; bottom?: number; left?: number};
  flex?: number;
}>`
  ${({flex}) => !!flex && `flex: ${flex};`}
  flex-direction: ${({layout}) => layout};

  ${({space}) =>
    !!space &&
    Object.entries(space).map(([pos, val]) => `margin-${pos}: ${val}px;`)}
`;

const ValueBox = styled(View)`
  justify-content: flex-end;
  margin-top: 4px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({theme}) => theme.pallete.border.primary};
`;

const Box = styled(View)`
  flex: 1;
`;

const $Typography = styled(Typography)<{
  alignText?: 'left' | 'right' | 'center';
}>`
  ${({alignText}) => !!alignText && `text-align: ${alignText};`}
`;

export const ViewerStats = memo<ViewerStatsProps>(function ViewerStats({
  fragmentRef,
}) {
  const asset = useFragment<ViewerStatsDataProp>(
    graphql`
      fragment viewerStatsFragment_asset on Asset {
        price {
          currency
          marketCap
          volume24Hour
          volumePercentChange24Hour
          maxSupply
          circulatingSupply
          tradingActivity
          tradableMarketCapRank
        }
      }
    `,
    fragmentRef,
  );

  return (
    <Stack layout="column" space={{top: 24}}>
      <Typography variant="subtitle">Market stats</Typography>

      <Stack layout="row" space={{top: 16, left: 16}}>
        <Stack layout="column" space={{right: 32}} flex={1}>
          <Typography variant="body">Market cap</Typography>
          <ValueBox>
            <$Typography variant="body" alignText="right">
              {/* {JSON.stringify(asset.price)} */}
              {/* {formatCurrency(asset.price.marketCap, {
                currency: asset.price.currency,
              })} */}
              {formatDecimalUnitUsingCompactNotation(asset.price.marketCap)}
              {/* {formatCurrencyUsingCompactNotation(asset.price.marketCap, {
                currency: asset.price.currency,
              })} */}
            </$Typography>
          </ValueBox>
        </Stack>

        <Stack layout="column" flex={1}>
          <Box>
            <Typography variant="body">Volume 24h</Typography>
          </Box>
          <ValueBox>
            <$Typography variant="body" alignText="right">
              {/* {formatCurrencyUsingCompactNotation(asset.price.volume24Hour, {
                currency: asset.price.currency,
              })} */}
              {formatDecimalUnitUsingCompactNotation(asset.price.volume24Hour)}
            </$Typography>
          </ValueBox>
        </Stack>
      </Stack>

      <Stack layout="row" space={{top: 16, left: 16}}>
        <Stack layout="column" space={{right: 32}} flex={1}>
          <Typography variant="body">Circulating Supply</Typography>
          <ValueBox>
            <$Typography variant="body" alignText="right">
              {formatDecimalUnitUsingCompactNotation(
                asset.price.circulatingSupply,
              )}
            </$Typography>
          </ValueBox>
        </Stack>

        <Stack layout="column" flex={1}>
          <Box>
            <Typography variant="body">Max Supply</Typography>
          </Box>
          <ValueBox>
            <$Typography variant="body" alignText="right">
              {formatDecimalUnitUsingCompactNotation(asset.price.maxSupply)}
            </$Typography>
          </ValueBox>
        </Stack>
      </Stack>

      <Stack layout="row" space={{top: 16, left: 16}}>
        <Stack layout="column" space={{right: 32}} flex={1}>
          <Typography variant="body">Trading activity</Typography>
          <ValueBox>
            <$Typography variant="body" alignText="right">
              {Math.round(asset.price.tradingActivity * 100)}%
            </$Typography>
          </ValueBox>
        </Stack>

        <Stack layout="column" flex={1}>
          <Box>
            <Typography variant="body">Popularity</Typography>
          </Box>
          <ValueBox>
            <$Typography variant="body" alignText="right">
              #{asset.price.tradableMarketCapRank}
            </$Typography>
          </ValueBox>
        </Stack>
      </Stack>
    </Stack>
  );
});
