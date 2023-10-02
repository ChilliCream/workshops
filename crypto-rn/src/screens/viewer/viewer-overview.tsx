import styled from '@emotion/native';
import React, {memo} from 'react';
import {View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import type {viewerOverviewFragment_asset$key} from '@/__generated__/viewerOverviewFragment_asset.graphql';
import {Typography} from '@/components';

type ViewerOverviewDataProp = viewerOverviewFragment_asset$key;

interface ViewerOverviewProps {
  fragmentRef: ViewerOverviewDataProp;
}

const Stack = styled(View)<{
  layout: 'row' | 'column';
  space?: {top?: number; right?: number; bottom?: number; left?: number};
  flex?: number;
}>`
  ${({flex}) => !!flex && `flex: ${flex};`}
  flex-direction: ${({layout}) => layout};

  ${({space}) =>
    !!space &&
    Object.entries(space).map(([pos, val]) => `margin-${pos}: ${val}px;`)}
`;

export const ViewerOverview = memo<ViewerOverviewProps>(
  function ViewerOverview({fragmentRef}) {
    const asset = useFragment<ViewerOverviewDataProp>(
      graphql`
        fragment viewerOverviewFragment_asset on Asset {
          description
        }
      `,
      fragmentRef,
    );

    return (
      <Stack layout="column" space={{top: 24, bottom: 36}}>
        <Typography variant="subtitle">Overview</Typography>
        <Stack layout="column" space={{top: 8, left: 16}}>
          <Typography variant="body">{asset.description}</Typography>
        </Stack>
      </Stack>
    );
  },
);
