import {memo} from 'react';

import {formatCurrency} from '@/utils';

import {Typography} from '../core';
import type {TypographyVariant} from '../core';

export interface PriceProps {
  value: number;
  options?: object;
  locales?: string;
  typographyVariant?: TypographyVariant;
}

export const Price = memo<PriceProps>(function Price({
  value,
  options,
  locales,
  typographyVariant = 'body',
}) {
  return (
    <Typography variant={typographyVariant}>
      {formatCurrency(value, options, locales)}
    </Typography>
  );
});
