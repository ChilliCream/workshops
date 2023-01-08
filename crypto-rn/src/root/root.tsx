import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {Paths} from '@/paths';
import {Home} from '@/screens';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStack = {
  [Paths.Home]: undefined;
};

const {Navigator, Screen} = createNativeStackNavigator<RootStack>();

export const Root: React.FC = () => (
  <Navigator initialRouteName={Paths.Home}>
    <Screen name={Paths.Home} component={Home} />
  </Navigator>
);
