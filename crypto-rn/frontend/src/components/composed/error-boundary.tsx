import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';

export type ErrorBoundaryProps = React.PropsWithChildren;

export interface ErrorBoundaryState {
  error: boolean;
  message?: string;
}

export class ErrorBoundary extends PureComponent<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static getDerivedStateFromError() {
    return {error: true};
  }

  state: ErrorBoundaryState = {error: false};

  componentDidCatch(error: Error) {
    this.setState({message: error.message});
  }

  render() {
    return this.state.error ? (
      <View>
        <Text>Ooops, this is bad...</Text>
        {!!this.state.message && <Text>{`Error: ${this.state.message}`}</Text>}
      </View>
    ) : (
      this.props.children
    );
  }
}
