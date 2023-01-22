import {Link, Stack, Typography} from '@mui/material';
import NextLink from 'next/link';
import {memo} from 'react';

import {CryptoIcon} from '@/icons';

export const Currency = memo(function Currency({symbol, name, imageUrl}) {
  return (
    <NextLink
      href="/currencies/[symbol]"
      as={`/currencies/${symbol}`}
      passHref
      legacyBehavior
    >
      <Link underline="none">
        <Stack direction="row" alignItems="center" gap={2}>
          <CryptoIcon src={imageUrl} alt={name} size="medium" />
          <Stack direction="column">
            <Typography variant="caption">{name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {symbol}
            </Typography>
          </Stack>
        </Stack>
      </Link>
    </NextLink>
  );
});
