import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Suspense} from 'react';
import {Text, View} from 'react-native';

import {Paths} from '@/paths';
import {Home, Viewer} from '@/screens';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStack = {
  [Paths.Home]: undefined;
  [Paths.Viewer]: undefined;
};

const {Navigator, Screen} = createNativeStackNavigator<RootStack>();

export const Root: React.FC = () => {
  return (
    <Navigator initialRouteName={Paths.Home}>
      <Screen name={Paths.Home}>
        {() => (
          <Suspense fallback={<Text>Loading ...</Text>}>
            <Home />
          </Suspense>
        )}
      </Screen>
      <Screen name={Paths.Viewer} component={Viewer} />
    </Navigator>
  );
};
