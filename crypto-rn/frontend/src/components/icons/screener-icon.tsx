import React from 'react';
import {Path, Svg, SvgProps} from 'react-native-svg';

export const ScreenerIcon: React.FC<SvgProps> = (props) => (
  <Svg height="24" viewBox="0 0 24 24" width="24" {...props}>
    <Path d="M0 0h24v24H0V0z" fill="none" />
    <Path
      fill="#000"
      d="M7 9H2V7h5v2zm0 3H2v2h5v-2zm13.59 7-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L22 17.59 20.59 19zM17 11c0-1.65-1.35-3-3-3s-3 1.35-3 3 1.35 3 3 3 3-1.35 3-3zM2 19h10v-2H2v2z"
    />
  </Svg>
);
