import styled from '@emotion/styled';
import {Stack, Typography} from '@mui/material';
import {memo} from 'react';
import {graphql, useFragment} from 'react-relay';

import {DD, DL, DT, InfoText, Meter} from '@/components';
import {
  formatCurrencyUsingCompactNotation,
  formatDecimalUnitUsingCompactNotation,
} from '@/utils';

const Block = styled.div(
  ({theme}) => `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  column-gap: ${theme.spacing(2)};
  `,
);

export default memo(function ViewerStats({fragmentRef}) {
  const asset = useFragment(
    graphql`
      fragment ViewerStatsFragment_asset on Asset {
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
    <Stack p={2}>
      <Typography variant="h3" gutterBottom>
        Market stats
      </Typography>
      <Block>
        <DL>
          <DT>
            Market Cap
            <InfoText>
              The total market value of a cryptocurrency's circulating supply.
              <br />
              <br />
              Market Cap = Current Price x Circulating Supply.
            </InfoText>
          </DT>
          <DD>
            {formatCurrencyUsingCompactNotation(asset.price.marketCap, {
              currency: asset.price.currency,
            })}
          </DD>
        </DL>
        <DL>
          <DT>
            Volume 24h
            <InfoText>
              A measure of how much of a cryptocurrency was traded in the last
              24 hours.
            </InfoText>
          </DT>
          <DD>
            {formatCurrencyUsingCompactNotation(asset.price.volume24Hour, {
              currency: asset.price.currency,
            })}
          </DD>
        </DL>
        <DL>
          <DT>
            Circulating Supply
            <InfoText>
              The amount of coins that are circulating in the market and are in
              public hands. It is analogous to the flowing shares in the stock
              market.
            </InfoText>
          </DT>
          <DD>
            {formatDecimalUnitUsingCompactNotation(
              asset.price.circulatingSupply,
            )}
          </DD>
        </DL>
        <DL>
          <DT>
            Max Supply
            <InfoText>
              The maximum amount of coins that will ever exist in the lifetime
              of the cryptocurrency.
            </InfoText>
          </DT>
          <DD>
            {formatDecimalUnitUsingCompactNotation(asset.price.maxSupply)}
          </DD>
        </DL>
        <DL>
          <DT>
            Trading activity
            <InfoText>
              Market direction over the past 24 hours through trading.
            </InfoText>
          </DT>
          <DD align="auto">
            <Meter value={asset.price.tradingActivity} />
          </DD>
        </DL>
        <DL>
          <DT>
            Popularity
            <InfoText>
              Popularity is based on the relative market cap of tradable assets
            </InfoText>
          </DT>
          <DD>#{asset.price.tradableMarketCapRank}</DD>
        </DL>
      </Block>
    </Stack>
  );
});
