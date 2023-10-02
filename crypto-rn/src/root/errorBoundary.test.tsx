import {render} from '@testing-library/react-native';
import React from 'react';
import {Text} from 'react-native';

import {logger} from '@sl/native.common-utils';

import {ErrorBoundary} from './errorBoundary';

describe('<ErrorBoundary />', () => {
  const Tester: React.FC<{error: boolean}> = ({error}) => {
    if (error) {
      throw new Error('foo');
    }

    return <Text>foo</Text>;
  };

  const leSpy = jest.spyOn(logger, 'error');
  const ceSpy = jest.spyOn(console, 'error');

  afterEach(() => {
    leSpy.mockReset();
    ceSpy.mockReset();
  });

  afterAll(() => {
    leSpy.mockRestore();
    ceSpy.mockRestore();
  });

  const testCases: TestCases<
    [error: boolean, leTimes: number, ceTimes: number]
  > = [
    ['should catch errors', [true, 1, 1]],
    ['should pass through children when no error', [false, 0, 0]],
  ];

  testCases.forEach(([name, [error, leTimes, ceTimes]]) => {
    it(name, () => {
      leSpy.mockImplementation();
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

      expect(leSpy).toHaveBeenCalledTimes(leTimes);
      expect(ceSpy).toHaveBeenCalledTimes(ceTimes);
    });
  });
});
