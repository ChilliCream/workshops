import {ThemeProvider} from '@emotion/react';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

import {ErrorBoundary, Root} from './root';
import {defaultTheme} from './themes';
import {I18nextProvider, i18n} from './translations';

export const App: React.FC<any> = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={defaultTheme}>
            <NavigationContainer>
              <Root />
            </NavigationContainer>
          </ThemeProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};
