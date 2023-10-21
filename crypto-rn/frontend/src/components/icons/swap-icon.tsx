import {useTheme} from '@emotion/react';
import React from 'react';
import Svg, {Path} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';

export const SwapIcon: React.FC<SvgProps> = (props) => {
  const {pallete} = useTheme();

  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        stroke="#000000"
        d="M4 17h12M4 17l3.5-3.5M4 17l3.5 3.5M7 7h13m0 0l-3.5-3.5M20 7l-3.5 3.5"
      />
    </Svg>
  );
};
