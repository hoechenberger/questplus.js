import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
// Optionally Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
// import '@tensorflow/tfjs-node-gpu';

/**
 * A Weibull psychometric function.
 * 
 * @param intensity Stimulus values on the abscissa.
 * @param threshold The threshold parameter.
 * @param slope The slope parameter.
 * @param lower_asymptote The lower asymptote, which is equivalent to the
 *                        false-alarm rate in a yes-no task, or 1/n in an
 *                        n-AFC task.
 * @param lapse_rate The lapse rate. The upper asymptote of the psychometric
 *                   function will be 1-lapse rate.
 * @param scale The scale of the stimulus parameters. Possible values are
 *              ``log10`` and``linear``.
 */
const weibull = (
  intensity: number | Array<number>,
  threshold: number | Array<number>,
  slope: number = 3.5,
  lower_asymptote: number = 0.01,
  lapse_rate: number = 0.01,
  scale: string = 'log10') => {
  const intensities = tf.tensor(intensity);
  const thresholds = tf.tensor(threshold);
  const beta = tf.tensor(slope);
  const gamma = tf.tensor(lower_asymptote);
  const delta = tf.tensor(lapse_rate);

  const x = tf.matMul(
    tf.ones([thresholds.size, 1]),
    intensities.reshape([1, intensities.size])
  );

  const t = tf.matMul(
    thresholds.reshape([thresholds.size, 1]),
    tf.ones([1, intensities.size])
  );

  console.log(scale);
  const p0 = tf.tensor(1).sub(delta);
  const p1 = tf.tensor(1).sub(gamma).sub(delta);
  const p2 = tf.exp(tf.tensor(-1).mul(tf.tensor(10).pow(beta.mul(x.sub(t)))));
  const p3 = p1.mul(p2);
  const p4 = p0.sub(p3);
  // debugger;
  return p4;
};

console.log(weibull(
  [-3.5, -3, -2.5, -2, -1.5, -1, 0, 1],
  [-2, -1.5, 0]).print());


export default weibull;
