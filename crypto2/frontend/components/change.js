import {Typography} from '@mui/material';
import {memo} from 'react';

import {direction, formatPercent, toPascalCase} from '@/utils';

export const Change = memo(function Change({
  value,
  options,
  locales,
  size = 'medium',
}) {
  return (
    <Typography
      variant="caption"
      sx={(theme) => ({
        color: theme.palette.trend[direction(value)],
        fontSize: theme.typography[`fontSize${toPascalCase(size)}`],
        fontWeight: theme.typography.fontWeightMedium,
        lineHeight: 1,
      })}
    >
      {formatPercent(value, options, locales)}
    </Typography>
  );
});
