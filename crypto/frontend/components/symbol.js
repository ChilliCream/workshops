import {Typography} from '@mui/material';
import {memo} from 'react';

import {findClosestAccessibleColor, toPascalCase} from '@/utils';

export const Symbol = memo(function Symbol({value, color, size = 'medium'}) {
  return (
    <Typography
      variant="caption"
      sx={(theme) => ({
        color: findClosestAccessibleColor(
          color,
          theme.palette.background.default,
          3,
        ),
        fontSize: theme.typography[`fontSize${toPascalCase(size)}`],
        fontWeight: theme.typography.fontWeightMedium,
        lineHeight: 1,
      })}
    >
      {value}
    </Typography>
  );
});
