import {memo, useMemo} from 'react';
import {graphql, useFragment, useSubscription} from 'react-relay';

import {Ticker} from '@/components';

import DashboardTickerItem from './DashboardTickerItem';

export default memo(function DashboardTicker({fragmentRef}) {
  const data = useFragment(
    graphql`
      fragment DashboardTickerFragment_query on Query {
        ticker: assets(
          first: 10
          order: {price: {tradableMarketCapRank: ASC}}
        ) {
          nodes {
            id
            symbol
            ...DashboardTickerItemFragment_asset
          }
        }
      }
    `,
    fragmentRef,
  );
  const assets = data.ticker?.nodes;

  useSubscription(
    useMemo(
      () => ({
        subscription: graphql`
          subscription DashboardTickerSubscription($symbols: [String!]) {
            onPriceChange(symbols: $symbols) {
              ...DashboardTickerItemFragment_assetprice
            }
          }
        `,
        variables: {
          symbols: assets?.map(({symbol}) => symbol) ?? [],
        },
      }),
      [assets],
    ),
  );

  return (
    <Ticker>
      {assets?.map((asset) => (
        <DashboardTickerItem key={asset.id} fragmentRef={asset} />
      ))}
    </Ticker>
  );
});
