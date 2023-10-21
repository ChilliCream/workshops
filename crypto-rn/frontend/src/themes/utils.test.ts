import {genTypo} from './utils';

describe('genTypo', () => {
  describe('should generate', () => {
    const testCases: Array<[name: string, font: string, spacing?: number]> = [
      ['default fonts without spacing', 'default'],
      ['default fonts with spacing', 'default', 2],
      ['custom fonts with spacing', 'FooFont', 2],
    ];

    testCases.forEach(([name, font, spacing]) => {
      it(name, () => {
        const typography = genTypo(font, 28, 32, spacing);

        expect(typography).toMatchSnapshot();
      });
    });
  });
});
