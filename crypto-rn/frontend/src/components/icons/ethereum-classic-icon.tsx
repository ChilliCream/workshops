import React from 'react';
import Svg, {Circle, G, Path} from 'react-native-svg';

export const EthereumIcon: React.FC = (props) => (
  <Svg viewBox="0 0 32 32" {...props}>
    <G>
      <Circle cx="16" cy="16" r="16" fill="#12de8d" />
      <G fill="#fff">
        <Path fillOpacity=".6" d="M16.5 4v8.9l7.5 3.3z" />
        <Path d="M16.5 4 9 16.2l7.5-3.3z" />
        <Path fillOpacity=".6" d="M16.5 22v6L24 17.6z" />
        <Path d="M16.5 28v-6L9 17.6z" />
        <Path fillOpacity=".2" d="m16.5 20.6 7.5-4.4-7.5-3.3z" />
        <Path fillOpacity=".6" d="m9 16.2 7.5 4.4v-7.7z" />
      </G>
    </G>
  </Svg>
);
