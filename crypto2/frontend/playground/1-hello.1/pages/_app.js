import {CacheProvider} from '@emotion/react';
import {CssBaseline, ThemeProvider} from '@mui/material';

import {Layout, Metadata, ModeProvider, SlotsProvider} from '@/components';
import {usePreferredTheme} from '@/hooks';
import {createEmotionCache} from '@/styles';

const clientSideEmotionCache = createEmotionCache();

export default function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) {
  const [theme, mode] = usePreferredTheme();

  return (
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
  );
}
