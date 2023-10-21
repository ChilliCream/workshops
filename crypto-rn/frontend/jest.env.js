//#region 1: Extend Jest matchers for RN
import '@testing-library/jest-native/extend-expect';

/* eslint-disable */

('use strict');

//#endregion

//#region 2: Setup TL (React Native)
jest.mock('@testing-library/react-native', () => {
  const TLRN = jest.requireActual('@testing-library/react-native');
  const React = jest.requireActual('react');

  const {render} = TLRN;

  //#region 1: Context
  const {ThemeProvider} = jest.requireActual('@emotion/react');
  const {SafeAreaProvider} = jest.requireActual(
    'react-native-safe-area-context',
  );

  const {defaultTheme} = jest.requireActual('./src/themes');

  const wrapper = ({children}) => (
    <ThemeProvider theme={defaultTheme}>
      <SafeAreaProvider
        initialMetrics={{
          frame: {x: 0, y: 0, width: 0, height: 0},
          insets: {top: 0, left: 0, right: 0, bottom: 0},
        }}
      >
        {children}
      </SafeAreaProvider>
    </ThemeProvider>
  );
  //#endregion

  //#region 2: Custom render
  return Object.assign({}, TLRN, {
    render: (component, options) =>
      render(component, {
        ...options,
        wrapper: (options?.wrapper ?? wrapper) || undefined,
      }),
  });
  //#endregion
});
//#endregion

//#region 3: Fix issue due to testEnvironment jsdom (instead node)
// jest-emotion needs jsdom, testing-library needs node
// https://stackoverflow.com/questions/68708955/jest-test-error-browsertype-launch-setimmediate-is-not-defined-while-using-pl
global.setImmediate = (callback) => setTimeout(callback, 0);
global.clearImmediate = (id) => clearTimeout(id);
//#endregion
