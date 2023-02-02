import {memo, useEffect, useState} from 'react';
import Svg, {Path} from 'react-native-svg';

import d3 from './d3';

interface GraphProps {
  height: number;
  width: number;
  offset: number;
  color: string;
  data: [number, number][];
}

const scaleData = (
  height: number,
  width: number,
  offset: number,
  data: [number, number][],
): [number, number][] => {
  const scalePriceToY = d3
    .scaleLinear()
    .range([height - offset, offset])
    .domain(d3.extent(data, ([price]) => price) as number[]);

  const scaleTimeToX = d3
    .scaleTime()
    .range([0, width])
    .domain(d3.extent(data, ([, time]) => time) as number[]);

  return data.map(([price, time]) => [
    scalePriceToY(price),
    scaleTimeToX(time),
  ]);
};

export const Graph = memo<GraphProps>(function Graph({
  height,
  width,
  offset,
  color,
  data,
}) {
  const [[, current], setScaledData] = useState<
    [[number, number][] | null, [number, number][] | null]
  >(() => [null, null]);

  const line =
    d3.shape
      .line()
      .x(([, time]) => time)
      .y(([price]) => price)
      .curve(d3.shape.curveMonotoneX)(current ?? []) ?? undefined;

  useEffect(() => {
    if (height && width) {
      const next = scaleData(height, width, offset, data);
      const initial = current ?? next.map(([, time]) => [height, time]);

      setScaledData([initial, next]);
    }
  }, [height, width, offset, data]);

  return line ? (
    <Svg width={width} height={height}>
      <Path d={line} stroke={color} strokeWidth={2} />
    </Svg>
  ) : null;
});
