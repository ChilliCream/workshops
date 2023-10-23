import {ThemeProvider} from '@emotion/react';
import {NavigationContainer} from '@react-navigation/native';
import React, {Suspense} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {RelayEnvironmentProvider} from 'react-relay';

import {initEnvironment} from '@/client';

import {ErrorBoundary, Spinner} from './components';
import {Root} from './root';
import {defaultTheme} from './themes';

const relayEnv = initEnvironment(undefined);

export const App: React.FC<any> = () => {
  const handleReady = () => {
    SplashScreen.hide();
  };

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <RelayEnvironmentProvider environment={relayEnv}>
            <Suspense fallback={<Spinner />}>
              <ThemeProvider theme={defaultTheme}>
                <NavigationContainer onReady={handleReady}>
                  <Root />
                </NavigationContainer>
              </ThemeProvider>
            </Suspense>
          </RelayEnvironmentProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};
