import '@azure/core-asynciterator-polyfill';

import {Buffer} from '@craftzdog/react-native-buffer';

import 'fastestsmallesttextencoderdecoder';

import {AppRegistry} from 'react-native';
import {fetch, Headers, Request, Response} from 'react-native-fetch-api';

import 'react-native-gesture-handler';

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
};

polyfillGlobal('Buffer', () => Buffer);
polyfillGlobal('ReadableStream', () => ReadableStream);
polyfillGlobal('WritableStream', () => WritableStream);

polyfillGlobal('fetch', () => fetch);
polyfillGlobal('Headers', () => Headers);
polyfillGlobal('Request', () => Request);
polyfillGlobal('Response', () => Response);

init();
