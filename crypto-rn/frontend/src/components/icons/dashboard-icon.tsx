import React, {memo} from 'react';
import {Path, Svg, SvgProps} from 'react-native-svg';

export const DashboardIcon = memo<SvgProps>(function DashboardIcon(props) {
  return (
    <Svg height="24" viewBox="0 0 24 24" width="24" {...props}>
      <Path d="M0 0h24v24H0V0z" fill="none" />
      <Path
        fill="#000"
        d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"
      />
    </Svg>
  );
});
