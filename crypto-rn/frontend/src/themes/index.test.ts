import * as Index from './index';

describe('index', () => {
  it('should keep shape', () => {
    expect(Index).toMatchSnapshot();
  });
});
