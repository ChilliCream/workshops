import {Component} from 'react';

export class ErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    if (error instanceof Error) {
      error._suppressLogging = true;
    }

    return {error};
  }

  state = {error: false};

  render() {
    const {children, fallback = null} = this.props;
    const {error} = this.state;

    return error
      ? typeof fallback === 'function'
        ? fallback({error})
        : fallback
      : children;
  }
}
