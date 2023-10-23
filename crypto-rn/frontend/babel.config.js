'use strict';

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['relay'],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
    ['@emotion'],
    ['module:react-native-dotenv'],
    ['react-native-reanimated/plugin'],
  ],
};
