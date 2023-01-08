import {NavigationContainer} from '@react-navigation/native';
import {render} from '@testing-library/react-native';
import React from 'react';

import {Root} from './root';

describe('<Root />', () => {
  it('should render', () => {
    const {getByTestId} = render(
      <NavigationContainer>
        <Root />
      </NavigationContainer>,
    );

    expect(getByTestId('view:home')).toBeTruthy();
  });
});
