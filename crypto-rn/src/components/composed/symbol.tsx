import React, {memo} from 'react';

import {Typography} from '../core';

export interface SymbolProps {
  value: string;
  color: string;
  size: 'small' | 'medium';
}

export const Symbol = memo<SymbolProps>(function Symbol({
  value,
  color,
  size = 'medium',
}) {
  return (
    <Typography
      variant={size === 'medium' ? 'body' : 'caption'}
      color={color}
      weight="bold"
    >
      {value}
    </Typography>
  );
});
