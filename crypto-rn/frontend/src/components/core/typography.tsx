import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import React, {memo} from 'react';
import {Text, type TextProps} from 'react-native';

import type {DefaultTheme} from '@/themes';

export type TypographyVariant = keyof DefaultTheme['typography'];
export type TypographyWeight = 'normal' | 'bold';

interface TypographyProps extends TextProps {
  variant: TypographyVariant;
  weight?: TypographyWeight;
  color?: string;
}

const $Text = styled(Text)<{
  variant: TypographyVariant;
  weight: TypographyWeight;
  color: string;
}>`
  ${({theme, variant}) => theme.typography[variant]}
  color: ${({color}) => color};
  font-weight: ${({weight}) => (weight === 'normal' ? '300' : 'bold')};
`;

export const Typography = memo<React.PropsWithChildren<TypographyProps>>(
  function Typography({
    variant,
    weight = 'normal',
    color,

    ...rest
  }) {
    const {pallete} = useTheme();

    return (
      <$Text
        variant={variant}
        weight={weight}
        color={color ?? pallete.foreground}
        {...rest}
      />
    );
  },
);
