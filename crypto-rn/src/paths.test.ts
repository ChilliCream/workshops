import {Paths} from './paths';

describe('Paths', () => {
  it('should keep shape', () => {
    expect(Paths).toMatchSnapshot();
  });
});
