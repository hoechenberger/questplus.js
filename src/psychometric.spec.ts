// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-node';

import weibull from './psychometric';

describe('weibull', () => {
  it('works', () => {
    expect(() => weibull(
      [10, 100, 1000, 10000],
      [10, 100, 1000, 10000])
    );
    // weibull(
    //   [10, 100, 1000, 10000],
    //   [10, 100, 1000, 10000]).print()
    // weibull(
    //   [-3.5, -3, -2.5, -2, -1.5, -1, 0, 1],
    //   [-2, -1.5, 0],
    //   [3.5, 3.0]).print();
    // const foo = weibull(
    //   [-3.5, -3, -2.5, -2, -1.5, -1, 0, 1],
    //   [-1.5, 0]
    // ).squeeze()
    // foo.print()
    // console.log(foo)

    // tf.stack([foo, bar]).print()
    // tf.stack([foo, bar]).gather(0).print()
  });
});
