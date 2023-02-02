/// <reference types="@sl/native.common-types" />
import '@types/react/experimental';

import type {RootStack} from '@/root';

declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
