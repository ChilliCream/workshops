import {useTheme} from '@emotion/react';
import {Suspense} from 'react';

import {ErrorBoundary, Spinner} from '@/components';

import {Viewer as Screen} from './viewer';
import type {ViewerProps} from './viewer';

export const Viewer: React.FC<ViewerProps> = (props) => {
  const {pallete} = useTheme();

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <Spinner
            spinnerColor={pallete.brand.primary}
            innerColor={pallete.background.secondary}
          />
        }
      >
        <Screen {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};
