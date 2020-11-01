import weibull from './index';

describe('weibull', () => {
  it('works', () => {
    expect(() => weibull(
      [10, 100, 1000, 10000],
      [10, 100, 1000, 10000])
    );
    console.log(weibull(
      [10, 100, 1000, 10000],
      [100]).print()
    );
  });
});
