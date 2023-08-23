import {Suspense} from 'react';

import {ActivityIndicator, Drawer, ErrorBoundaryWithRetry} from '@/components';
import {useAlerts} from '@/hooks';

import AlertsContainer from './AlertsContainer';

export const Alerts = ({symbol}) => {
  const {active, hide} = useAlerts();

  return (
    <Drawer
      anchor="bottom"
      open={active}
      PaperProps={{sx: {height: 400}}}
      ModalProps={{keepMounted: false}}
      onClose={hide}
    >
      <ErrorBoundaryWithRetry>
        {({cacheBuster}) => (
          <Suspense fallback={<ActivityIndicator />}>
            <AlertsContainer symbol={symbol} cacheBuster={cacheBuster} />
          </Suspense>
        )}
      </ErrorBoundaryWithRetry>
    </Drawer>
  );
};
