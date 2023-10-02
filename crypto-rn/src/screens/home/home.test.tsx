import {render} from '@testing-library/react-native';
import React from 'react';

import {Home} from './home';

describe('<Home />', () => {
  it('should render', () => {
    const {toJSON, getByTestId} = render(<Home />);

    expect(getByTestId('view:home')).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });
});
