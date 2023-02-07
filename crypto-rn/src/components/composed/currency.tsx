import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import {memo} from 'react';
import {View} from 'react-native';
import type {ImageSourcePropType} from 'react-native';

import {Typography} from '../core';
import {CryptoIcon} from '../icons';

export interface CurrencyProps {
  symbol: number | string;
  name: string;
  imageUrl?: ImageSourcePropType | string | null;
  last?: boolean;
}

const Stack = styled(View)<{
  layout: 'row' | 'column';
  last?: boolean;
  gap?: number;
}>`
  flex-direction: ${({layout}) => layout};
`;

const Gap = styled(View)<{
  size: number;
  layout?: 'row' | 'column';
}>`
  ${({size, layout = 'column'}) =>
    layout === 'column'
      ? `
    width: 1px;
    height: ${size}px;
  `
      : `
    width: ${size}px;
    height: 1px;
  `}
`;

export const Currency = memo<CurrencyProps>(function Currency({
  symbol,
  name,
  imageUrl,
  last,
}) {
  const {pallete} = useTheme();
  return (
    <Stack last={last} layout="row">
      {!!imageUrl && <CryptoIcon src={imageUrl} size="medium" />}
      <Gap size={8} layout="row" />
      <Stack layout="column">
        <Typography
          variant="caption"
          color={pallete.brand.primary}
          weight="bold"
        >
          {name}
        </Typography>
        <Typography variant="caption">{symbol}</Typography>
      </Stack>
    </Stack>
  );
});
