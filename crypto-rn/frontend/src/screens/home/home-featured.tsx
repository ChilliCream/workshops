import React, {memo} from 'react';
import {Dimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {FragmentRef, graphql, useFragment} from 'react-relay';

import type {homeFeaturedFragment_query$key} from '@/__generated__/homeFeaturedFragment_query.graphql';

import {HomeFeaturedCard} from './home-featured-card';

type HomeFeaturedDataProp = homeFeaturedFragment_query$key;

interface HomeFeaturedProps {
  fragmentRef: FragmentRef<any>;
}

export const HomeFeatured = memo<HomeFeaturedProps>(function HomeFeatured({
  fragmentRef,
}) {
  const data = useFragment<HomeFeaturedDataProp>(
    graphql`
      fragment homeFeaturedFragment_query on Query {
        featured: assets(where: {symbol: {in: ["BTC", "ADA", "ALGO"]}}) {
          nodes {
            id
            ...homeFeaturedCardFragment_asset
          }
        }
      }
    `,
    fragmentRef,
  );

  const assets = data.featured?.nodes;

  return assets?.length ? (
    <FlatList
      horizontal={true}
      data={assets}
      decelerationRate="fast"
      snapToAlignment="center"
      snapToInterval={Dimensions.get('screen').width}
      renderItem={({item}) => (
        <HomeFeaturedCard key={item.id} fragmentRef={item} />
      )}
    />
  ) : null;
});
