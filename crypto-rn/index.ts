import 'fast-text-encoding';
import {AppRegistry} from 'react-native';

import {name as appName} from './app.json';
import {App} from './src/app';

const init = () => {
  // Register and start the app.
  AppRegistry.registerComponent(appName, () => App);
};

init();
