import {useMediaQuery} from '@mui/material';
import {useEffect, useMemo, useState} from 'react';

import {Config, syncWithStorage} from '@/config';
import {createTheme} from '@/styles';

export const usePreferredTheme = (initial) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(initial);

  useEffect(() => {
    if (initial === undefined) {
      const stored = Config.MODE ?? (prefersDarkMode ? 'dark' : 'light');

      if (stored && mode !== stored) {
        setMode(stored);
      }
    }
  }, []);

  useEffect(() => {
    syncWithStorage({MODE: mode});
  }, [mode]);

  return useMemo(
    () => [
      createTheme(mode),
      {
        mode,
        setModeLight() {
          setMode('light');
        },
        setModeDark() {
          setMode('dark');
        },
        setModeAuto() {
          setMode(prefersDarkMode ? 'dark' : 'light');
        },
        toggleMode() {
          setMode(mode === 'light' ? 'dark' : 'light');
        },
      },
    ],
    [prefersDarkMode, mode],
  );
};
