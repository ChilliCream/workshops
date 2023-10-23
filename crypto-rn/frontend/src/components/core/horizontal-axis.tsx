import styled from '@emotion/native';
import {memo} from 'react';
import {View} from 'react-native';

import type {ChangeSpan} from '@/generated/ViewerSnapshotRefetchableQuery.graphql';
import {formatDateForSpan} from '@/utils';

import d3 from './d3';
import {Typography} from './typography';

interface HorizontalAxisProps {
  data: [number, number][];
  span: ChangeSpan;
  ticks: number;
}

const generateTicks = (data: [number, number][], ticks: number) => {
  if (data.length < 2 || ticks < 2) {
    return null;
  }

  const [minTime, maxTime] = d3.extent(data, ([, time]) => time);

  if (minTime && maxTime) {
    const rangeStep = (maxTime - minTime) / (ticks - 1);
    const generatedTicks = [];

    for (let i = 0; i < ticks; i += 1) {
      generatedTicks.push(minTime + i * rangeStep);
    }

    return generatedTicks;
  }

  return null;
};

const Root = styled(View)`
  flex-direction: row;
  width: 100%;
  padding: 4px 8px;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${({theme}) => theme.pallete.border.primary};
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({theme}) => theme.pallete.border.primary};
  justify-content: space-between;
  text-transform: uppercase;
`;

export const HorizontalAxis = memo<HorizontalAxisProps>(
  function HorizontalAxis({data, span, ticks}) {
    return (
      <Root>
        {generateTicks(data, ticks)?.map((value) => (
          <Typography key={value} variant="caption">
            {formatDateForSpan(value, span)}
          </Typography>
        ))}
      </Root>
    );
  },
);
