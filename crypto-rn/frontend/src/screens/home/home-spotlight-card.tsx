import styled from '@emotion/native';
import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {graphql, useFragment} from 'react-relay';

import type {homeSpotlightCardFragment_asset$key} from '@/__generated__/homeSpotlightCardFragment_asset.graphql';
import {SwapIcon, Typography} from '@/components';

import {HomeSpotlightItem} from './home-spotlight-item';

const Views = {
  CHANGE: 'change',
  PRICE: 'price',
} as const;

type HomeSpotlightCardDataProp = homeSpotlightCardFragment_asset$key;

interface HomeSpotlightCardProps {
  title: string;
  avatar: React.FunctionComponent;
  fragmentRef: HomeSpotlightCardDataProp;
}

const Stack = styled(View)<{
  layout: 'row' | 'column';
  space?: {top?: number; right?: number; bottom?: number; left?: number};
}>`
  flex: 1;
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

const Root = styled(View)`
  flex: 1;
  margin: 0px 10px;
`;

const Divider = styled(View)`
  width: 100%;
  height: 1px;
  background-color: ${({theme}) => theme.pallete.border.primary};
`;

export const HomeSpotlightCard: React.FC<HomeSpotlightCardProps> = ({
  avatar: Avatar,
  fragmentRef,
  title,
}) => {
  const data = useFragment<HomeSpotlightCardDataProp>(
    graphql`
      fragment homeSpotlightCardFragment_asset on AssetsConnection {
        nodes {
          id
          ...homeSpotlightItemFragment_asset
        }
      }
    `,
    fragmentRef,
  );

  const [view, setView] = useState<ValuesOf<typeof Views>>(Views.CHANGE);

  const assets = data?.nodes;

  return (
    <Root>
      <Stack layout="row" space={{top: 16, bottom: 8}}>
        <Stack layout="row">
          <Avatar />
          <Typography style={{marginLeft: 16}} variant="subtitle">
            {title}
          </Typography>
        </Stack>
        <View style={{alignSelf: 'flex-end', flexBasis: 30}}>
          <Pressable
            hitSlop={32}
            onPress={() =>
              setView(view === Views.CHANGE ? Views.PRICE : Views.CHANGE)
            }
          >
            <SwapIcon width={26} height={26} />
          </Pressable>
        </View>
      </Stack>

      <FlatList
        style={{marginLeft: 16, marginRight: 16}}
        scrollEnabled={false}
        data={assets}
        renderItem={({item}) => (
          <HomeSpotlightItem key={item.id} fragmentRef={item} view={view} />
        )}
        ItemSeparatorComponent={() => <Divider />}
      />

      {/* <Stack layout="column">
        {assets?.map((node) => (
          <HomeSpotlightItem key={node.id} fragmentRef={node} view={view} />
        ))}
      </Stack> */}
    </Root>
  );
};
