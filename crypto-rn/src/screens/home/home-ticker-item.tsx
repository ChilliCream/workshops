import styled from '@emotion/native';
import {Link} from '@react-navigation/native';
import React, {memo} from 'react';
import {View} from 'react-native';
import {graphql, useFragment} from 'react-relay';
import type {FragmentRef} from 'react-relay';

import type {homeTickerItemFragment_asset$key} from '@/__generated__/homeTickerItemFragment_asset.graphql';
import {Change, Price, Symbol} from '@/components';

export const HOME_TICKER_ITEM_WIDTH = 100;

graphql`
  fragment homeTickerItemFragment_assetprice on AssetPrice {
    currency
    lastPrice
    change24Hour
  }
`;

type HomeTickerItemAssetDataProp = homeTickerItemFragment_asset$key;

interface HomeTickerItemProps {
  fragmentRef: FragmentRef<any>;
}

const Stack = styled(View)`
  flex-direction: column;
  width: ${String(HOME_TICKER_ITEM_WIDTH)}px;
  margin-bottom: 4px;
  margin-top: 4px;
`;

export const HomeTickerItem = memo<HomeTickerItemProps>(
  function HomeTickerItem({fragmentRef}) {
    const asset = useFragment<HomeTickerItemAssetDataProp>(
      graphql`
        fragment homeTickerItemFragment_asset on Asset {
          symbol
          color
          price {
            ...homeTickerItemFragment_assetprice @relay(mask: false)
          }
        }
      `,
      fragmentRef,
    );
    const {price, symbol, color} = asset;

    return (
      <Link to="/Viewer">
        <Stack>
          <Symbol value={symbol} color={color} size="small" />
          <Price value={price.lastPrice} options={{currency: price.currency}} />
          <Change value={price.change24Hour} />
        </Stack>
      </Link>
    );
  },
);
