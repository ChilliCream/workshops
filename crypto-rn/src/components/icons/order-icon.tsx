import React from 'react';
import Svg, {Path} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';

export const OrderIcon: React.FC<SvgProps> = (props) => {
  return (
    <Svg height="24" viewBox="0 0 24 24" width="24" {...props}>
      <Path d="M0 0h24v24H0V0z" fill="none" />
      <Path
        fill="#000"
        d="M6 7h2.5L5 3.5 1.5 7H4v10H1.5L5 20.5 8.5 17H6V7zm4-2v2h12V5H10zm0 14h12v-2H10v2zm0-6h12v-2H10v2z"
      />
    </Svg>
  );
};
