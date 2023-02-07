import styled from '@emotion/native';
import React, {memo} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import type {screenerQuery} from '@/__generated__/screenerQuery.graphql';
import {Header} from '@/components';

import {ScreenerList} from './screener-list';

type ScreenerDataProp = screenerQuery;

const Root = styled(View)`
  flex: 1;
  background-color: ${({theme}) => theme.pallete.background.primary};
`;

export const Screener = memo(function Screener() {
  const data = useLazyLoadQuery<ScreenerDataProp>(
    graphql`
      query screenerQuery {
        ...screenerListFragment_query
      }
    `,
    {},
  );

  return (
    <>
      <Header />
      <Root>
        <ScreenerList fragmentRef={data} />
      </Root>
    </>
  );
});
