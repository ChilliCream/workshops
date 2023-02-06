import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, {Suspense} from 'react';
import {Text} from 'react-native';

import {Paths} from '@/paths';
import {Home, Viewer} from '@/screens';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStack = {
  [Paths.Home]: undefined;
  [Paths.Viewer]: {symbol: string};
};

export type StackNavigationProps<T extends keyof RootStack> =
  NativeStackNavigationProp<RootStack, T>;
export type StackScreenProps<T extends keyof RootStack> =
  NativeStackScreenProps<RootStack, T>;

const {Navigator, Screen} = createNativeStackNavigator<RootStack>();

export const Root: React.FC = () => {
  return (
    <Navigator initialRouteName={Paths.Home}>
      <Screen name={Paths.Home}>
        {(props) => (
          <Suspense fallback={<Text>Loading ...</Text>}>
            <Home {...props} />
          </Suspense>
        )}
      </Screen>
      <Screen name={Paths.Viewer}>
        {(props) => (
          <Suspense fallback={<Text>Loading ...</Text>}>
            <Viewer {...props} />
          </Suspense>
        )}
      </Screen>
    </Navigator>
  );
};
