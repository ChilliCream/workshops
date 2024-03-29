import {useTheme} from '@emotion/react';
import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const AppIcon: React.FC<SvgProps> = (props) => {
  const {pallete} = useTheme();

  return (
    <Svg viewBox="0 0 3888 3684" color={pallete.brand.primary} {...props}>
      <Path
        fill="currentColor"
        d="M2939.6 1198.9C2718.3 826.7 2314 599.3 1851.8 599.3 1152 599.3 606.4 1137.7 606.4 1842S1152 3138.9 1851.8 3138.9c462.2 0 866.5-270.8 1087.8-643H3574c-262.2 694.5-940.2 1188-1722.1 1188C841 3684 0 2859.4 0 1842S841 0 1851.8 0c781.9 0 1460 504.5 1722 1199h-634.2Zm948.4 426.4-639 455h-801.6A644.5 644.5 0 0 1 1202 1847.5a644.5 644.5 0 0 1 1249.5-222.1H3888Z"
      />
    </Svg>
  );
};
