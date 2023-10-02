import * as Screens from './index';

describe('Screens', () => {
  it('should keep shape', () => {
    expect(Screens).toMatchSnapshot();
  });
});
