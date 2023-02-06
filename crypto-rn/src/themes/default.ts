import {Colors} from './colors';
import {genTypo} from './utils';

export const defaultTheme = {
  pallete: {
    brand: {
      primary: Colors.ORANGE,
    },
    foreground: Colors.BLACK,
    background: {
      primary: Colors.WHITE,
      secondary: Colors.OPAQUE,
    },
    border: {
      primary: Colors.OPAQUE,
    },
    trend: {
      positive: Colors.GREEN,
      negative: Colors.RED,
      neutral: Colors.GRAY200,
    },
  },
  typography: {
    title: genTypo('default', 28, 36, 2),
    subtitle: genTypo('default', 16, 20, 2),
    body: genTypo('default', 14, 20),
    caption: genTypo('default', 12, 18),
  },
} as const;

export type DefaultTheme = typeof defaultTheme;
