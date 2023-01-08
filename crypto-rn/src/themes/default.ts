import {Colors} from './colors';
import {genTypo} from './utils';

export const defaultTheme = {
  pallete: {
    brand: {
      primary: Colors.RED,
    },
    foreground: Colors.BLACK,
  },
  typography: {
    title: genTypo('default', 28, 36, 2),
  },
} as const;

export type DefaultTheme = typeof defaultTheme;
