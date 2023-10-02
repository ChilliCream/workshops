import {ThemeProvider} from '@emotion/react';
import {NavigationContainer} from '@react-navigation/native';
import React, {Suspense, useEffect} from 'react';
import {Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {RelayEnvironmentProvider} from 'react-relay';

import {initEnvironment} from '@/config/relay';

import {ErrorBoundary, Root} from './root';
import {defaultTheme} from './themes';
import {I18nextProvider, i18n} from './translations';

const relayEnv = initEnvironment(undefined);

export const App: React.FC<any> = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <RelayEnvironmentProvider environment={relayEnv}>
            <Suspense fallback={<Text>Loading ...</Text>}>
              <I18nextProvider i18n={i18n}>
                <ThemeProvider theme={defaultTheme}>
                  <NavigationContainer>
                    <Root />
                  </NavigationContainer>
                </ThemeProvider>
              </I18nextProvider>
            </Suspense>
          </RelayEnvironmentProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};
