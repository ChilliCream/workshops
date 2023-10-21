import React from 'react';
import Svg, {G, Path, type SvgProps} from 'react-native-svg';

export const BullishIcon: React.FC<SvgProps> = (props) => (
  <Svg viewBox="0 0 48 48" {...props}>
    <Path
      fill="#4CAF50"
      stroke="none"
      d="M40 21h4v23h-4zm-6 7h4v16h-4zm-6-5h4v21h-4zm-6 6h4v15h-4zm-6 3h4v12h-4zm-6-2h4v14h-4zm-6 4h4v10H4z"
    />
    <G fill="#388E3C" stroke="none">
      <Path d="M40.1 9.1 34 15.2l-4-4-10 10-5-5L4.6 26.6l2.8 2.8 7.6-7.6 5 5 10-10 4 4 8.9-8.9z" />
      <Path d="M44 8h-9l9 9z" />
    </G>
  </Svg>
);
