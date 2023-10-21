import type {DefaultTheme} from '../default';

declare module '@emotion/react/types' {
  export interface Theme extends DefaultTheme {}
}
