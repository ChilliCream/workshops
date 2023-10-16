import styled from '@emotion/native';
import React, {memo} from 'react';
import {ScrollView} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import type {viewerQuery} from '@/__generated__/viewerQuery.graphql';
import {Header, Typography} from '@/components';
import type {StackScreenProps} from '@/root';

import {ViewerHeader} from './viewer-header';
import {ViewerOverview} from './viewer-overview';
import {ViewerSnapshot} from './viewer-snapshot';
import {ViewerStats} from './viewer-stats';

type ViewerDataProp = viewerQuery;

const Root = styled(ScrollView)`
  flex: 1;
  padding: 12px;
  background-color: ${({theme}) => theme.pallete.background.primary};
`;

export const Viewer = memo<StackScreenProps<'Viewer'>>(function Viewer({
  route,
}) {
  const {
    params: {symbol},
  } = route;

  const data = useLazyLoadQuery<ViewerDataProp>(
    graphql`
      query viewerQuery($symbol: String!) {
        assetBySymbol(symbol: $symbol) {
          ...viewerHeaderFragment_asset
          ...viewerSnapshotFragment_asset
          ...viewerStatsFragment_asset
          ...viewerOverviewFragment_asset
        }
      }
    `,
    {symbol},
  );

  if (!data.assetBySymbol) {
    return (
      <Typography variant="body">This currency could not be found</Typography>
    );
  }

  return (
    <>
      <Header back={true} />
      <Root
        showsVerticalScrollIndicator={false}
        disableScrollViewPanResponder={true}
      >
        <ViewerHeader fragmentRef={data.assetBySymbol} />
        <ViewerSnapshot fragmentRef={data.assetBySymbol} />
        <ViewerStats fragmentRef={data.assetBySymbol} />
        <ViewerOverview fragmentRef={data.assetBySymbol} />
      </Root>
    </>
  );
});
