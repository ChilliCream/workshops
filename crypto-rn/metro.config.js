/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
'use strict';

const {getDefaultConfig} = require('metro-config');
const {makeMetroConfig} = require('@rnx-kit/metro-config');
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();

  return makeMetroConfig({
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      resolveRequest: MetroSymlinksResolver(),
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
          enableBabelRuntime: true,
        },
      }),
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
  });
})();
