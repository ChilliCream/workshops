import {logger} from '@sl/native.common-utils';
import {render} from '@testing-library/react-native';
import React from 'react';
import {Text} from 'react-native';

import {ErrorBoundary} from './errorBoundary';

describe('<ErrorBoundary />', () => {
  const Tester: React.FC<{error: boolean}> = ({error}) => {
    if (error) {
      throw new Error('foo');
    }

    return <Text>foo</Text>;
  };

  const ceSpy = jest.spyOn(console, 'error');

  afterEach(() => {
    ceSpy.mockReset();
  });

  afterAll(() => {
    ceSpy.mockRestore();
  });

  const testCases: Array<[string, [error: boolean, ceTimes: number]]> = [
    ['should catch errors', [true, 1]],
    ['should pass through children when no error', [false, 0]],
  ];

  testCases.forEach(([name, [error, ceTimes]]) => {
    it(name, () => {
      ceSpy.mockImplementation();

      expect(() => {
        const {getByText, queryByText} = render(
          <ErrorBoundary>
            <Tester error={error} />
          </ErrorBoundary>,
        );

        if (error) {
          expect(queryByText('foo')).toBeFalsy();
        } else {
          expect(getByText('foo')).toBeTruthy();
        }
      }).not.toThrow();

      expect(ceSpy).toHaveBeenCalledTimes(ceTimes);
    });
  });
});
