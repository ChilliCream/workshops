import {CacheProvider} from '@emotion/react';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {useEffect} from 'react';

import {
  Content,
  Hacks,
  Metadata,
  ModeProvider,
  SlotsProvider,
} from '@/components';
import {usePreferredTheme} from '@/hooks';
import {createEmotionCache} from '@/styles';

const clientSideEmotionCache = createEmotionCache();

export default function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) {
  const [theme, mode] = usePreferredTheme();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <ModeProvider value={mode}>
          <Metadata />
          <CssBaseline enableColorScheme />
          <SlotsProvider>
            <Content>
              <Component {...pageProps} />
            </Content>
          </SlotsProvider>
          <Hacks />
        </ModeProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
