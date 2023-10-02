export const Colors = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  RED: '#CF202F',
  ORANGE: '#FF8C00',
  GREEN: '#098551',

  GRAY100: '#757972',
  GRAY200: '#424242',
  GRAY300: '#15232C',

  OPAQUE: '#00000012',
} as const;

export type Color = ValuesOf<typeof Colors>;
