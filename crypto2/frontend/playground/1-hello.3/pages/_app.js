import {CacheProvider} from '@emotion/react';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {RelayEnvironmentProvider} from 'react-relay';

import {useEnvironment} from '@/client';
import {Layout, Metadata, ModeProvider, SlotsProvider} from '@/components';
import {usePreferredTheme} from '@/hooks';
import {createEmotionCache} from '@/styles';

const clientSideEmotionCache = createEmotionCache();

export default function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) {
  const environment = useEnvironment();
  const [theme, mode] = usePreferredTheme();

  return (
    <RelayEnvironmentProvider environment={environment}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <ModeProvider value={mode}>
            <Metadata />
            <CssBaseline enableColorScheme />
            <SlotsProvider>
              <Layout variant="splash">
                <Component {...pageProps} />
              </Layout>
            </SlotsProvider>
          </ModeProvider>
        </ThemeProvider>
      </CacheProvider>
    </RelayEnvironmentProvider>
  );
}
