import {Suspense} from 'react';

import {ActivityIndicator, ErrorBoundaryWithRetry} from '@/components';

import ViewerContainer from './ViewerContainer';

export const Viewer = ({symbol}) => (
  <ErrorBoundaryWithRetry>
    {({cacheBuster}) => (
      <Suspense fallback={<ActivityIndicator />}>
        <ViewerContainer symbol={symbol} cacheBuster={cacheBuster} />
      </Suspense>
    )}
  </ErrorBoundaryWithRetry>
);
