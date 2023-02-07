import styled from '@emotion/native';
import {Link, useLinkProps, useLinkTo} from '@react-navigation/native';
import React, {memo} from 'react';
import {View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import type {screenerListItemFragment_asset$key} from '@/__generated__/screenerListItemFragment_asset.graphql';
import {Change, Currency, Price} from '@/components';

type ScreenerListItemDataProp = screenerListItemFragment_asset$key;

interface ScreenerListItemProps {
  fragmentRef: ScreenerListItemDataProp;
}

const Stack = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const Root = styled(View)`
  width: 100%;
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
    const {price} = asset;

    // const {onPress} = useLinkProps({to: {screen: 'Viewer', params: {symbol: asset.symbol}}});

    return (
      <Link
        to={{screen: 'Viewer', params: {symbol: asset.symbol}}}
        style={{marginBottom: 8, marginTop: 16}}
      >
        <Root>
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
      </Link>
    );
  },
);
