import {Typography} from '@mui/material';
import {memo} from 'react';

import {formatCurrencyUsingCompactNotation, toPascalCase} from '@/utils';

export const MarketCap = memo(function MarketCap({
  value,
  options,
  locales,
  size = 'medium',
}) {
  return (
    <Typography
      variant="caption"
      sx={(theme) => ({
        color: theme.palette.text.primary,
        fontSize: theme.typography[`fontSize${toPascalCase(size)}`],
        fontWeight: theme.typography.fontWeightMedium,
        lineHeight: 1,
      })}
    >
      {formatCurrencyUsingCompactNotation(value, options, locales)}
    </Typography>
  );
});
