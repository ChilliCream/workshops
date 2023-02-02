import styled from '@emotion/native';
import React from 'react';
import {View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {homeSpotlightItemFragment_asset$key} from '@/__generated__/homeSpotlightItemFragment_asset.graphql';
import {Change, Currency, Price} from '@/components';

export type HomeSpotlightItemView = 'price' | 'change';
type HomeSpotlightItemDataProp = homeSpotlightItemFragment_asset$key;

interface HomeSpotlightItemProps {
  view: HomeSpotlightItemView;
  fragmentRef: HomeSpotlightItemDataProp;
}

const Stack = styled(View)`
  flex: 1;
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Root = styled(View)`
  padding: 8px;
`;

const $Currency = styled(Currency)`
  flex: 1;
  align-self: flex-start;
  margin-right: auto;
`;

const Value = styled(View)`
  flex-basis: 20%;
  width: 20%;
  align-items: flex-end;
  justify-content: center;
`;

export const HomeSpotlightItem: React.FC<HomeSpotlightItemProps> = ({
  view,
  fragmentRef,
}) => {
  const asset = useFragment<HomeSpotlightItemDataProp>(
    graphql`
      fragment homeSpotlightItemFragment_asset on Asset {
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

  const {price} = asset;

  console.log('VIEW ===> ', view);

  return (
    <Root>
      <Stack>
        <$Currency
          symbol={asset.symbol}
          name={asset.name}
          imageUrl={asset.imageUrl}
        />

        <Value>
          {price && view === 'price' && (
            <Price
              value={price.lastPrice}
              options={{currency: price.currency}}
              typographyVariant="caption"
            />
          )}
          {price && view === 'change' && (
            <Change value={price.change24Hour} typographyVariant="caption" />
          )}
        </Value>
      </Stack>
    </Root>
  );
};
