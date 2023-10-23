import {memo} from 'react';
import {Dimensions} from 'react-native';

import type {homeFeaturedCardFragment_asset$data} from '@/generated/homeFeaturedCardFragment_asset.graphql';

import {Graph} from '../core/graph';

const WIDTH = Dimensions.get('screen').width - 32;

type SmallChartDataProp = NonNullable<
  NonNullable<
    NonNullable<
      homeFeaturedCardFragment_asset$data['price']['change']
    >['history']
  >['nodes']
>;

interface SmallChartProps {
  color: string;
  data: SmallChartDataProp;
}

export const SmallChart = memo<SmallChartProps>(function SmallChart({
  color,
  data,
}) {
  const dataInMs = data.map<[number, number]>((item) => [
    item?.price ? item.price : 0,
    item?.epoch ? item.epoch * 1000 : 0,
  ]);

  return (
    <Graph
      height={150}
      width={WIDTH}
      offset={6}
      color={color}
      data={dataInMs}
    />
  );
});