import styled from '@emotion/native';
import {memo} from 'react';
import {Dimensions, View} from 'react-native';

import type {ChangeSpan} from '@/generated/ViewerSnapshotRefetchableQuery.graphql';
import type {homeFeaturedCardFragment_asset$data} from '@/generated/homeFeaturedCardFragment_asset.graphql';
import {clamp} from '@/utils';

import {Graph} from '../core/graph';
import {HorizontalAxis} from '../core/horizontal-axis';

const WIDTH = Dimensions.get('screen').width;

const calculateTicks = (width: number, size = 100, min = 3, max = 6) =>
  clamp(Math.floor(width / size), min, max);

type BigChartDataProp = NonNullable<
  NonNullable<
    NonNullable<
      homeFeaturedCardFragment_asset$data['price']['change']
    >['history']
  >['nodes']
>;

interface BigChartProps {
  color: string;
  data: BigChartDataProp;
  span: ChangeSpan;
}

const BigPane = styled(View)`
  height: 208px;
  position: relative;
`;

export const BigChart = memo<BigChartProps>(function BigChart({
  color,
  data,
  span,
}) {
  const dataInMs = data.map<[number, number]>((item) => [
    item?.price ? item.price : 0,
    item?.epoch ? item.epoch * 1000 : 0,
  ]);

  return (
    <>
      <BigPane>
        <Graph
          height={150}
          width={WIDTH}
          offset={6}
          color={color}
          data={dataInMs}
        />
      </BigPane>
      <HorizontalAxis
        data={dataInMs}
        span={span}
        ticks={calculateTicks(WIDTH)}
      />
    </>
  );
});
