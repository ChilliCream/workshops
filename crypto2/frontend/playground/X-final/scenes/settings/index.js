import {Suspense} from 'react';

import {ActivityIndicator, ErrorBoundaryWithRetry} from '@/components';

import SettingsContainer from './SettingsContainer';

export const Settings = () => (
  <ErrorBoundaryWithRetry>
    {({cacheBuster}) => (
      <Suspense fallback={<ActivityIndicator />}>
        <SettingsContainer cacheBuster={cacheBuster} />
      </Suspense>
    )}
  </ErrorBoundaryWithRetry>
);
