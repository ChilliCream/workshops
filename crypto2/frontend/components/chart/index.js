import styled from '@emotion/styled';
import {useTheme} from '@mui/material';
import {memo} from 'react';

import {useSize} from '@/hooks';
import {clamp, findClosestAccessibleColor} from '@/utils';

import {Graph} from './graph';
import {HorizontalAxis} from './horizontal-axis';
import {Indicator} from './indicator';

const calculateTicks = (width, size = 100, min = 3, max = 6) =>
  clamp(Math.floor(width / size), min, max);

const BigPane = styled.div`
  height: 208px;
  width: 100%;
  position: relative;
`;

export const BigChart = memo(function BigChart({color, data, currency, span}) {
  const [paneRef, size] = useSize();
  const theme = useTheme();

  const accessibleColor = findClosestAccessibleColor(
    color,
    theme.palette.background.default,
    3,
  );
  const dataInMs = data.map((item) => [item.price, item.epoch * 1000]);

  return (
    <>
      <BigPane ref={paneRef}>
        {size && (
          <Graph
            height={size.height}
            width={size.width}
            offset={6}
            color={accessibleColor}
            data={dataInMs}
          />
        )}
        {size && (
          <Indicator
            height={size.height}
            width={size.width}
            offset={6}
            color={accessibleColor}
            data={dataInMs}
            currency={currency}
          />
        )}
      </BigPane>
      {size && (
        <HorizontalAxis
          data={dataInMs}
          span={span}
          ticks={calculateTicks(size.width)}
        />
      )}
    </>
  );
});

const SmallPane = styled.div`
  height: 150px;
  width: 100%;
  position: relative;
`;

export const SmallChart = memo(function SmallChart({color, data}) {
  const [paneRef, size] = useSize();
  const theme = useTheme();

  const accessibleColor = findClosestAccessibleColor(
    color,
    theme.palette.background.default,
    3,
  );
  const dataInMs = data.map((item) => [item.price, item.epoch * 1000]);

  return (
    <SmallPane ref={paneRef}>
      {size && (
        <Graph
          height={size.height}
          width={size.width}
          offset={6}
          color={accessibleColor}
          data={dataInMs}
        />
      )}
    </SmallPane>
  );
});
