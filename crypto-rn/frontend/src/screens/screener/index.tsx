import {useTheme} from '@emotion/react';
import {Suspense} from 'react';

import {ErrorBoundary, Spinner} from '@/components';

import {Screener as Screen} from './screener';

export const Screener: React.FC = (props) => {
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
