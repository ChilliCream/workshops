import {act, render, waitFor} from '@testing-library/react';
import {Component, Suspense} from 'react';
import {RelayEnvironmentProvider} from 'react-relay';
import {
  createMockEnvironment,
  MockPayloadGenerator,
  RelayMockEnvironment,
} from 'relay-test-utils';

import {Greetings} from './Greetings';

describe('<Greetings />', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation();

  /** @type {RelayMockEnvironment} */
  let environment;

  class ErrorBoundary extends Component {
    static getDerivedStateFromError(error) {
      return {error};
    }

    state = {error: false};

    render() {
      const {children, fallback} = this.props;
      const {error} = this.state;

      return error ? fallback : children;
    }
  }

  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={environment}>
      <ErrorBoundary fallback="error">
        <Suspense fallback="loading">
          <Greetings />
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );

  beforeEach(() => {
    environment = createMockEnvironment();
  });

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('should handle loading state', () => {
    const {getByText} = render(<TestRenderer />);

    expect(getByText('loading')).toBeInTheDocument();
  });

  it('should handle data state with automatic mock', async () => {
    const {getByText} = render(<TestRenderer />);

    act(() => {
      environment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation),
      );
    });

    await waitFor(() => {
      expect(
        getByText('<mock-value-for-field-"greetings">'),
      ).toBeInTheDocument();
    });
  });

  it('should handle data state with custom mock', async () => {
    const {getByText} = render(<TestRenderer />);

    act(() => {
      environment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Query() {
            return {
              greetings: `Hello, ${operation.request.variables.name}!`,
            };
          },
        }),
      );
    });

    await waitFor(() => {
      expect(getByText('Hello, Luke!')).toBeInTheDocument();
    });
  });

  it('should handle error state', async () => {
    const {getByText} = render(<TestRenderer />);

    act(() => {
      environment.mock.rejectMostRecentOperation(new Error('Uh-oh'));
    });

    await waitFor(() => {
      expect(getByText('error')).toBeInTheDocument();
    });
  });
});
