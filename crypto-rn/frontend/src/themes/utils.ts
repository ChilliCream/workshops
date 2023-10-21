import {css} from '@emotion/native';
import type {TextStyle} from 'react-native';

export const genTypo = (
  fontName: string,
  fontSize: number,
  lineHeight: number,
  spacing?: number,
) => css<TextStyle>`
  ${fontName !== 'default' && `font-family: ${fontName};`}
  font-size: ${`${fontSize}px`};
  line-height: ${`${lineHeight}px`};
  letter-spacing: ${spacing ? `${(fontSize * spacing) / 100}px` : '0px'};
`;
