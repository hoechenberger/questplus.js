import * as tf from '@tensorflow/tfjs'


const meshgrid = (
  args: Array<tf.Tensor1D>,
  indexing: string = 'xy'
): Array<tf.Tensor> => {
  const ndim = args.length
  const s0 = Array(ndim).fill(1)
  const output_dtype = args[0].dtype

  let output: Array<tf.Tensor> = []
  args.forEach((x, i) => {
    // New shape: insert missing dimensions.
    const shape = s0.slice(0, i).concat([-1]).concat(s0.slice(i + 1))
    const xReshaped = x.reshape(shape)
    output = output.concat([xReshaped])
  })

  let shapes: Array<number> = []
  args.forEach((x) => {
    shapes = shapes.concat([x.size])
  })

  if (indexing === 'xy' && ndim > 1) {
    const shape_0 = [1, -1].concat(Array(ndim - 2).fill(1))
    const shape_1 = [-1, 1].concat(Array(ndim - 2).fill(1))
    output[0] = output[0].reshape(shape_0)
    output[1] = output[1].reshape(shape_1)

    shapes = [shapes[1], shapes[0], ...shapes.slice(2)]
  }

  const multFact = tf.ones(shapes, output_dtype)
  let finalOutput: Array<tf.Tensor> = []
  output.forEach((x) => {
    finalOutput = finalOutput.concat([x.mul(multFact)])
  })

  return finalOutput
}

export default meshgrid
