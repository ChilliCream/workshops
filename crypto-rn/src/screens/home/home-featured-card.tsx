import styled from '@emotion/native';
import {Link} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, View} from 'react-native';
import {FragmentRef, graphql, useFragment} from 'react-relay';

import type {homeFeaturedCardFragment_asset$key} from '@/__generated__/homeFeaturedCardFragment_asset.graphql';
import {Change, Price, SmallChart, Symbol} from '@/components';

const WIDTH = Dimensions.get('screen').width;

type HomeFeaturedCardDataProp = homeFeaturedCardFragment_asset$key;

interface HomeFeaturedCardProps {
  fragmentRef: FragmentRef<any>;
}

const Root = styled(View)`
  border: 1px solid ${({theme}) => theme.pallete.border.primary};
`;

const Stack = styled(View)`
  width: ${WIDTH};
  flex-direction: row;
  margin-bottom: 8px;
  padding: 16px;
`;

const Gap = styled(View)`
  width: 16px;
`;

export const HomeFeaturedCard = memo<HomeFeaturedCardProps>(
  function HomeFeaturedCard({fragmentRef}) {
    const asset = useFragment<HomeFeaturedCardDataProp>(
      graphql`
        fragment homeFeaturedCardFragment_asset on Asset {
          symbol
          color
          price {
            currency
            lastPrice
            change24Hour
            change(span: DAY) {
              history {
                nodes {
                  epoch
                  price
                }
              }
            }
          }
        }
      `,
      fragmentRef,
    );

    const {price} = asset;

    if (!price.change?.history?.nodes?.length) {
      return null;
    }

    return (
      <Link
        to={{screen: 'Viewer', params: {symbol: asset.symbol}}}
        style={{margin: 16}}
      >
        <Root>
          <Stack>
            <Symbol size="medium" value={asset.symbol} color={asset.color} />
            <Gap />
            <Price
              value={price.lastPrice}
              options={{currency: price.currency}}
            />
            <Gap />
            <Change value={price.change24Hour} />
          </Stack>
          <SmallChart color={asset.color} data={price.change.history.nodes} />
        </Root>
      </Link>
    );
  },
);
