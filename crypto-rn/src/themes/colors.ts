export const Colors = {
  BLACK: '#000000',
  RED: '#D82034',
} as const;

export type Color = ValuesOf<typeof Colors>;
