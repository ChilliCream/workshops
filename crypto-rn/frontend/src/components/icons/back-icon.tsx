import React from 'react';
import {Path, Svg, SvgProps} from 'react-native-svg';

export const BackIcon: React.FC<SvgProps> = (props) => (
  <Svg height="24" viewBox="0 0 24 24" width="24" {...props}>
    <Path d="M0 0h24v24H0V0z" fill="none" />
    <Path
      fill="#000"
      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
    />
  </Svg>
);
