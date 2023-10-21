import styled from '@emotion/native';
import React, {memo} from 'react';
import {View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import type {viewerHeaderFragment_asset$key} from '@/__generated__/viewerHeaderFragment_asset.graphql';
import {Chip, CryptoIcon, Typography} from '@/components';

type ViewerHeaderDataProp = viewerHeaderFragment_asset$key;

interface ViewerHeaderProps {
  fragmentRef: ViewerHeaderDataProp;
}

const Stack = styled(View)<{
  layout: 'row' | 'column';
  space?: {top?: number; right?: number; bottom?: number; left?: number};
}>`
  flex-direction: ${({layout}) => layout};

  ${({layout}) =>
    layout === 'row'
      ? `
    align-items: center;
  `
      : `
    justify-content: center;
  `}

  ${({space}) =>
    !!space &&
    Object.entries(space).map(([pos, val]) => `margin-${pos}: ${val}px;`)}
`;

const Gap = styled(View)`
  width: 8px;
  height: 1px;
`;

export const ViewerHeader = memo<ViewerHeaderProps>(function ViewerHeader({
  fragmentRef,
}) {
  const asset = useFragment<ViewerHeaderDataProp>(
    graphql`
      fragment viewerHeaderFragment_asset on Asset {
        id
        symbol
        name
        imageUrl
        isInWatchlist
        hasAlerts
      }
    `,
    fragmentRef,
  );

  return (
    <Stack layout="row" space={{bottom: 16}}>
      {!!asset.imageUrl && (
        <>
          <CryptoIcon src={asset.imageUrl} size="large" />
          <Gap />
        </>
      )}
      <Typography variant="title">{asset.name}</Typography>
      <Gap />
      <Chip label={asset.symbol} />
    </Stack>
  );
});
