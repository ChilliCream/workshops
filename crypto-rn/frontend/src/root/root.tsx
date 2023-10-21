import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, {Suspense} from 'react';
import {Text} from 'react-native';

import {Paths} from '@/paths';
import {Home, Screener, Viewer} from '@/screens';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStack = {
  [Paths.Home]: undefined;
  [Paths.Viewer]: {symbol: string};
  [Paths.Screener]: undefined;
};

export type StackNavigationProps<T extends keyof RootStack> =
  NativeStackNavigationProp<RootStack, T>;
export type StackScreenProps<T extends keyof RootStack> =
  NativeStackScreenProps<RootStack, T>;

const {Navigator, Screen} = createNativeStackNavigator<RootStack>();

export const Root: React.FC = () => {
  return (
    <Navigator initialRouteName={Paths.Home}>
      <Screen name={Paths.Home} options={{headerShown: false}}>
        {(props) => (
          <Suspense fallback={<Text>Loading ...</Text>}>
            <Home {...props} />
          </Suspense>
        )}
      </Screen>
      <Screen name={Paths.Viewer} options={{headerShown: false}}>
        {(props) => (
          <Suspense fallback={<Text>Loading ...</Text>}>
            <Viewer {...props} />
          </Suspense>
        )}
      </Screen>
      {/* <Screen name={Paths.Screener} options={{headerShown: false}}>
        {(props) => (
          <Suspense>
            <Screener {...props} />
          </Suspense>
        )}
      </Screen> */}
      <Screen
        name={Paths.Screener}
        component={Screener}
        options={{headerShown: false}}
      />
    </Navigator>
  );
};
