/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
'use strict';

const {makeMetroConfig} = require('@rnx-kit/metro-config');
const {assetExts, sourceExts} = require('metro-config/src/defaults/defaults');

module.exports = makeMetroConfig({
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    unstable_enableSymlinks: true,
  },
});
