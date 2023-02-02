// import { polyfill as polyfillCrypto } from 'react-native-polyfill-globals/src/crypto';
import 'fast-text-encoding';
import {AppRegistry} from 'react-native';
// import {polyfill as polyfillEncoding} from 'react-native-polyfill-globals/src/encoding';
// import { polyfill as polyfillURL } from 'react-native-polyfill-globals/src/url';
import {polyfill as polyfillFetch} from 'react-native-polyfill-globals/src/fetch';
import {polyfill as polyfillReadableStream} from 'react-native-polyfill-globals/src/readable-stream';

import {name as appName} from './app.json';
import {App} from './src/app';

const init = () => {
  // Register and start the app.
  AppRegistry.registerComponent(appName, () => App);
};

// Apply polyfills
// polyfillEncoding();
polyfillReadableStream();
polyfillFetch();

init();
