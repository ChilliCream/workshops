import styled from '@emotion/native';
import React from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import type {homeQuery} from '@/__generated__/homeQuery.graphql';

import {HomeFeatured} from './home-featured';
import {HomeSpotlight} from './home-spotlight';
import {HomeTicker} from './home-ticker';

const WIDTH = Dimensions.get('screen').width;

const $SafeAreaView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.pallete.background};
`;

const Stack = styled(ScrollView)`
  flex: 1;
`;

const Divider = styled(View)`
  width: ${WIDTH - 20}px;
  margin: 0px 10px;
  height: 1px;
  background-color: ${({theme}) => theme.pallete.border.primary};
`;

export const Home: React.FC = () => {
  const data = useLazyLoadQuery<homeQuery>(
    graphql`
      query homeQuery {
        ...homeTickerFragment_query
        ...homeFeaturedFragment_query
        ...homeSpotlightFragment_query
      }
    `,
    {},
  );

  return (
    <$SafeAreaView testID="view:home">
      <Stack
        showsVerticalScrollIndicator={false}
        disableScrollViewPanResponder={true}
      >
        <HomeTicker fragmentRef={data} />
        <Divider />
        <HomeFeatured fragmentRef={data} />
        <Divider />
        <HomeSpotlight fragmentRef={data} />
      </Stack>
    </$SafeAreaView>
  );
};
