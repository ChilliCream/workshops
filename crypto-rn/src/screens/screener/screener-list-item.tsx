import styled from '@emotion/native';
import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Pressable, View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import type {screenerListItemFragment_asset$key} from '@/__generated__/screenerListItemFragment_asset.graphql';
import {Change, Currency, Price} from '@/components';
import {StackNavigationProps} from '@/root';

type ScreenerListItemDataProp = screenerListItemFragment_asset$key;

interface ScreenerListItemProps {
  fragmentRef: ScreenerListItemDataProp;
}

const Stack = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Root = styled(Pressable)`
  width: 100%;
  padding: 8px;
`;

const $Currency = styled(Currency)`
  flex: 2;
`;

const Values = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
`;

const Gap = styled(View)`
  height: 1px;
  width: 32px;
`;

export const ScreenerListItem = memo<ScreenerListItemProps>(
  function ScreenerListItem({fragmentRef}) {
    const asset = useFragment<ScreenerListItemDataProp>(
      graphql`
        fragment screenerListItemFragment_asset on Asset {
          id
          symbol
          name
          imageUrl
          isInWatchlist
          price {
            currency
            lastPrice
            change24Hour
          }
        }
      `,
      fragmentRef,
    );
    const {navigate} = useNavigation<StackNavigationProps<'Screener'>>();

    const {price} = asset;

    // const {onPress} = useLinkProps({to: {screen: 'Viewer', params: {symbol: asset.symbol}}});

    return (
      <Root onPress={() => navigate('Viewer', {symbol: asset.symbol})}>
        <Stack>
          <$Currency
            symbol={asset.symbol}
            name={asset.name}
            imageUrl={asset.imageUrl}
          />

          <Values>
            <Price
              value={price.lastPrice}
              options={{currency: price.currency}}
              typographyVariant="caption"
            />

            <Gap />

            <Change value={price.change24Hour} typographyVariant="caption" />
          </Values>
        </Stack>
      </Root>
    );
  },
);
