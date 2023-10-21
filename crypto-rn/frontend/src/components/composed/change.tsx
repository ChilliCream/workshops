import {useTheme} from '@emotion/react';
import {memo} from 'react';

import {direction, formatPercent} from '@/utils';

import {Typography, type TypographyVariant} from '../core';

export interface ChangeProps {
  value: number;
  options?: object;
  locales?: string;
  typographyVariant?: TypographyVariant;
}

export const Change = memo<ChangeProps>(function Change({
  value,
  options,
  locales,
  typographyVariant = 'caption',
}) {
  const {pallete} = useTheme();

  return (
    <Typography
      variant={typographyVariant}
      color={pallete.trend[direction(value)]}
    >
      {formatPercent(value, options, locales)}
    </Typography>
  );
});
