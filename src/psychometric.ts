import * as tf from '@tensorflow/tfjs';

import meshgrid from './meshgrid';

/**
 * A Weibull psychometric function.
 * 
 * @param intensity Stimulus values on the abscissa.
 * @param threshold The threshold parameter.
 * @param slope The slope parameter.
 * @param lower_asymptote The lower asymptote, which is equivalent to the
 * false-alarm rate in a yes-no task, or 1/n in an n-AFC task.
 * @param lapse_rate The lapse rate. The upper asymptote of the psychometric
 * function will be 1-lapse rate.
 * @param scale The scale of the stimulus parameters. Possible values are
 * ``log10`` and``linear``.
 */
const weibull = (
  intensity: number | Array<number>,
  threshold: number | Array<number>,
  slope: number | Array<number> = 3.5,
  lower_asymptote: number | Array<number> = 0.01,
  lapse_rate: number | Array<number> = 0.01,
  scale: 'log10' | 'linear' = 'log10'
): tf.Tensor => {
  const intensities = tf.tensor([intensity]);
  const thresholds = tf.tensor([threshold]);
  const betas = tf.tensor([slope]);
  const gammas = tf.tensor([lower_asymptote]);
  const deltas = tf.tensor([lapse_rate]);

  const mesh = meshgrid(
    [
      intensities.flatten(),
      thresholds.flatten(),
      betas.flatten(),
      gammas.flatten(),
      deltas.flatten()
    ], 'ij'
  )

  const x = mesh[0]
  const t = mesh[1]
  const b = mesh[2]
  const g = mesh[3]
  const d = mesh[4]

  const p0 = tf.scalar(1).sub(d)
  const p1 = tf.scalar(1).sub(g).sub(d)
  let p2: tf.Tensor
  if (scale === 'log10') {
    p2 = tf.exp(tf.scalar(-1).mul(tf.scalar(10).pow(b.mul(x.sub(t)))))
  } else {
    p2 = tf.exp(tf.scalar(-1).mul((x.div(t)).pow(b)))
  }
  const p = p0.sub(p1.mul(p2))
  return p
}


export default weibull
