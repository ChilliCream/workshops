/* eslint-disable */

'use strict';

//#region 1: React Navigation mocks
require('react-native-gesture-handler/jestSetup');

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock native navigation
jest.mock('@react-navigation/native', () => {
  const RNN = jest.requireActual('@react-navigation/native');

  return Object.assign({}, RNN, {
    useNavigation: jest.fn().mockReturnValue({
      navigate: jest.fn(),
      reset: jest.fn(),
      dispatch: jest.fn(),
      setOptions: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: jest.fn(),
  });
});
//#endregion

//#region 2: i18n mocks
jest.mock('react-i18next', () => {
  const RI18N = jest.requireActual('react-i18next');

  return Object.assign({}, RI18N, {
    useTranslation: () => {
      return {
        t: (str) => str,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
          language: 'de',
        },
      };
    },
    Trans: () => null,
  });
});
jest.mock('i18next', () => {
  const RI18N = jest.requireActual('i18next');

  return Object.assign({}, RI18N, {
    t: (str) => str,
    use: () => {
      return {
        init: () => {},
      };
    },
  });
});
//#endregion

//#region 3: NativeEventEmitter mock
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
//#endregion

//#region 4: react-native-safe-area-context mock
jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);
//#endregion
