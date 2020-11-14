import * as tf from '@tensorflow/tfjs'
import meshgrid from './meshgrid';

describe('meshgrid', () => {
  it('works', () => {
    [1, 2, 3]
    console.log(
      meshgrid(
        [
          tf.tensor1d([1, 2, 3]),
          tf.tensor1d([44, 55]),
          tf.tensor1d([666])
        ]
      )
    )
  })
})
