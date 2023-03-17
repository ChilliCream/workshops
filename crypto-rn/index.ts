import '@azure/core-asynciterator-polyfill';
import {Buffer} from '@craftzdog/react-native-buffer';
import 'fastestsmallesttextencoderdecoder';
import {AppRegistry} from 'react-native';
import {Headers, Request, Response, fetch} from 'react-native-fetch-api';
import {polyfillGlobal} from 'react-native/Libraries/Utilities/PolyfillFunctions';
import {
  ReadableStream,
  WritableStream,
} from 'web-streams-polyfill/ponyfill/es6';

import {name as appName} from './app.json';
import {App} from './src/app';

const init = () => {
  // Register and start the app.
  AppRegistry.registerComponent(appName, () => App);

  const b = Buffer.from([255, 220, 210, 150]);

  console.log(b);
};

polyfillGlobal('Buffer', () => Buffer);
polyfillGlobal('ReadableStream', () => ReadableStream);
polyfillGlobal('WritableStream', () => WritableStream);

polyfillGlobal('fetch', () => fetch);
polyfillGlobal('Headers', () => Headers);
polyfillGlobal('Request', () => Request);
polyfillGlobal('Response', () => Response);

init();
