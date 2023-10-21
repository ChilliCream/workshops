import {render} from '@testing-library/react-native';
import React from 'react';
import * as RNS from 'react-native-splash-screen';

import {App} from './app';

jest.mock('react-native-splash-screen', () => ({
  __esModule: true,
  default: {
    hide: jest.fn(),
  },
}));
jest.mock('./root/root', () => ({
  Root: () => 'MockedRoot',
}));

describe('App', () => {
  it('should render', () => {
    const {toJSON} = render(<App />);

    expect(RNS.default.hide).toHaveBeenCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });
});
