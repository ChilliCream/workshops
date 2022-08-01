# Testing

Testing applications that are using Relay may be challenging, because of the additional data fetching layer that is wrapping the actual product code.

And it’s not always easy to understand the mechanics of all processes that are happening behind Relay, and how to properly handle interactions with the framework.

Fortunately, there are tools that aim to simplify the process of writing tests for Relay components, by providing imperative APIs for controlling the request/response flow and additional API for mock data generation.

There are two main modules in `relay-test-utils` that you may use in your tests:

- `createMockEnvironment(options): RelayMockEnvironment`
- `MockPayloadGenerator` and the `@relay_test_operation` directive

Use `createMockEnvironment` to create an instance of `RelayMockEnvironment` which implements the Relay Environment Interface and it also has an additional Mock layer, with methods that allow to resolve/reject and control the flow of operations (queries/mutations/subscriptions).

The main purpose of `MockPayloadGenerator` is to improve the process of creating and maintaining the mock data for tested components.

Most of GraphQL type information for a specific field in the selection is not available during Relay runtime. Using the `@relay_test_operation` directive will add additional metadata containing GraphQL type info and it’ll improve the quality of the generated data.

For example, this test covers the `Greetings` shown before.

```js title="/scenes/Greetings.test.js"
import {act, render, waitFor} from '@testing-library/react';
import {Component, Suspense} from 'react';
import {RelayEnvironmentProvider} from 'react-relay';
import {
  MockPayloadGenerator,
  RelayMockEnvironment,
  createMockEnvironment,
} from 'relay-test-utils';

import Greetings from './Greetings';

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
```

:::tip Use the `goto` script as a shortcut

```sh
yarn goto playground/1-hello.3
```

:::

For more information, read the docs [here](https://relay.dev/docs/guides/testing-relay-components/).

---
