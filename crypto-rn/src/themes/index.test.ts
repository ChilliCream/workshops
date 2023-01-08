import * as Themes from './index';

describe('Themes', () => {
  it('should keep shape', () => {
    expect(Themes).toMatchSnapshot();
  });
});
