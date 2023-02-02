import styled from '@emotion/native';
import React, {memo, useEffect, useMemo, useRef} from 'react';
import {FlatList, View} from 'react-native';
import {graphql, useFragment, useSubscription} from 'react-relay';

import type {
  homeTickerFragment_query$data,
  homeTickerFragment_query$key,
} from '@/__generated__/homeTickerFragment_query.graphql';

import {HOME_TICKER_ITEM_WIDTH, HomeTickerItem} from './home-ticker-item';

type HomeTickerDataProp = homeTickerFragment_query$key;
type HomeTickerAssetsProp = NonNullable<
  NonNullable<homeTickerFragment_query$data['ticker']>['nodes']
>[0];

interface HomeTickerProps {
  fragmentRef: HomeTickerDataProp;
}

const Root = styled(View)`
  width: 100%;
  height: 68px;
  padding: 8px 0px;
  align-items: center;
`;

const ItemSeparator = styled(View)`
  width: 1px;
  height: 100%;
  margin-right: 8px;
  background-color: ${({theme}) => theme.pallete.border.primary};
`;

export const HomeTicker = memo<HomeTickerProps>(function HomeTicker({
  fragmentRef,
}) {
  const flatListRef = useRef<FlatList>(null);
  const currPos = useRef<number>(0);

  const data = useFragment<HomeTickerDataProp>(
    graphql`
      fragment homeTickerFragment_query on Query {
        ticker: assets(
          first: 10
          order: {price: {tradableMarketCapRank: ASC}}
        ) {
          nodes {
            id
            symbol
            ...homeTickerItemFragment_asset
          }
        }
      }
    `,
    fragmentRef,
  );

  const assets = data.ticker?.nodes?.length
    ? [
        ...data.ticker.nodes,
        ...data.ticker.nodes
          .filter((_, index) => index < 6)
          .map((item, index) =>
            Object.assign({}, item, {id: `${item.id}${index}`}),
          ),
      ]
    : undefined;
  const symbols = assets?.map(({symbol}) => symbol) ?? [];

  useSubscription(
    useMemo(
      () => ({
        subscription: graphql`
          subscription homeTickerSubscription($symbols: [String!]) {
            onPriceChange(symbols: $symbols) {
              ...homeTickerItemFragment_assetprice
            }
          }
        `,
        variables: {symbols},
      }),
      [String(symbols)],
    ),
  );

  const slide = () => {
    if (currPos.current < 0) {
      currPos.current = 0;
    }

    if (assets?.length) {
      const pos = currPos.current + 2;
      const maxOffset = (assets.length - 5) * HOME_TICKER_ITEM_WIDTH;

      flatListRef.current?.scrollToOffset({offset: pos, animated: false});

      if (currPos.current > maxOffset) {
        const offset = currPos.current - maxOffset + 11;

        flatListRef.current?.scrollToOffset({offset, animated: false});

        currPos.current = offset;
      } else {
        currPos.current = pos;
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(slide, 30);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Root>
      <FlatList<HomeTickerAssetsProp>
        ref={flatListRef}
        data={assets}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <HomeTickerItem key={item.id} fragmentRef={item} />
        )}
        keyExtractor={({id}) => id}
        ItemSeparatorComponent={ItemSeparator}
        getItemLayout={(_, index) => ({
          length: assets?.length ?? 0,
          offset: HOME_TICKER_ITEM_WIDTH * index,
          index,
        })}
      />
    </Root>
  );
});
