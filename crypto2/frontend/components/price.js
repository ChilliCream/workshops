import {Typography} from '@mui/material';
import {memo} from 'react';

import {formatCurrency, toPascalCase} from '@/utils';

export const Price = memo(function Price({
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
      {formatCurrency(value, options, locales)}
    </Typography>
  );
});
