import * as Root from './index';

describe('Root', () => {
  it('should keep shape', () => {
    expect(Root).toMatchSnapshot();
  });
});
