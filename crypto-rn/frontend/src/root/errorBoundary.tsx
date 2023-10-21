import type React from 'react';
import {PureComponent} from 'react';
import {Text} from 'react-native';

export type ErrorBoundaryProps = React.PropsWithChildren;

export interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends PureComponent<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static getDerivedStateFromError() {
    return {hasError: true};
  }

  state: ErrorBoundaryState = {hasError: false};

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary', error, info);
  }

  render() {
    return this.state.hasError ? (
      <Text>Oops, something went wrong!</Text>
    ) : (
      this.props.children
    );
  }
}
