import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';

import weibull from './psychometric'


interface IQpInitParams {
  stimDomain: any,
  paramDomain: any,
  outcomeDomain: any,
  prior: Array<number> | tf.Tensor | null,
  stimScale: 'log10' | 'linear'
}

interface IQpObject {
  stimDomain: any,
  paramDomain: any,
  outcomeDomain: any,
  likelihoods: tf.Tensor,
  prior: tf.Tensor,
  posterior: tf.Tensor,
  responses: Array<any>,
  stimuli: Array<any>,
  entropies: Array<number>
}

interface IQpPrediction {
  qp: IQpObject,
  nextStim: any
}

export const qpInit = ({
  stimDomain,
  paramDomain,
  outcomeDomain,
  prior = null,
  stimScale = 'log10'
}: IQpInitParams): IQpObject => {
  const likelihoods = _genLikelihoods(stimDomain, paramDomain, stimScale)

  if (prior === null) {
    prior = tf.ones([
      paramDomain.threshold.length,
      paramDomain.slope.length,
      paramDomain.lowerAsymptote.length,
      paramDomain.lapseRate.length
    ])
    prior = prior.div(prior.sum())
  } else if (Array.isArray(prior)) {
    prior = tf.tensor(prior)
  }
  // TODO Check that prior has the correct shape.

  const posterior = prior

  const qp = {
    stimDomain: stimDomain,
    paramDomain: paramDomain,
    outcomeDomain: outcomeDomain,
    likelihoods: likelihoods,
    prior: prior,
    posterior: posterior,
    responses: [],
    stimuli: [],
    entropies: []
  }

  return qp
}

export const qpPredict = (
  qp: IQpObject
): IQpPrediction => {
  let newPosterior = qp.posterior.mul(qp.likelihoods)

  // Probability.
  let pk = newPosterior.sum([2, 3, 4, 5])  // sum across paramDomain
  pk = pk.reshape([
    qp.outcomeDomain.response.length,
    qp.stimDomain.intensity.length,
    1, 1, 1, 1])
  newPosterior = newPosterior.div(pk)

  // Entropies.
  // TODO Do we need to handle tf.log(0) specially?
  const H = tf.scalar(-1).mul(newPosterior.mul(tf.log(newPosterior))).sum([2, 3, 4, 5])
  // Expected entropies for all possible stimulus parameters.
  const EH: tf.Tensor = (pk.squeeze().mul(H)).sum(0)  // Sum over outcome domain

  const minEntropy = EH.min()
  const minEntropyIndex = EH.argMin()
  const nextStim = {
    intensity: tf.tensor1d(qp.stimDomain.intensity).gather(minEntropyIndex).asScalar().dataSync()[0]
  }

  qp.entropies = qp.entropies.concat([minEntropy.asScalar().dataSync()[0]])
  return {
    qp: qp,
    nextStim: nextStim
  }
}

export const qpUpdate = (
  qp: IQpObject,
  stim: any,
  outcome: any
): IQpObject => {
  const intensityIndex = qp.stimDomain.intensity.findIndex((x: any) => x === stim.intensity)
  const responseIndex = qp.outcomeDomain.response.findIndex((x: any) => x === outcome.response)

  const likelihood = qp.likelihoods.gather(responseIndex).gather(intensityIndex)
  let posterior = qp.posterior.mul(likelihood)
  posterior = posterior.div(posterior.sum())

  // FIXME don't modify original qp!
  qp.posterior = posterior
  // Log the results, too.
  qp.stimuli = qp.stimuli.concat([stim])
  qp.responses = qp.responses.concat([outcome])

  return qp
}

export const qpParamEstimate = (
  qp: IQpObject
): number => {
  const thresholds = tf.tensor1d(qp.paramDomain.threshold)
  const probabilities = qp.posterior.squeeze()

  const meanThreshold = thresholds.mul(probabilities).sum()
  return meanThreshold.asScalar().dataSync()[0]
}

export const _genLikelihoods = (
  stimDomain: any,
  paramDomain: any,
  scale: 'log10' | 'linear'
): tf.Tensor => {
  const intensity = stimDomain.intensity
  const threshold = paramDomain.threshold
  const slope = paramDomain.slope
  const lowerAsymptote = paramDomain.lowerAsymptote
  const lapseRate = paramDomain.lapseRate

  const propCorrect = weibull(
    intensity, threshold, slope, lowerAsymptote, lapseRate, scale
  )
  const propIncorrect = tf.onesLike(propCorrect).sub(propCorrect)
  const likelihoods = tf.stack([propCorrect, propIncorrect])

  return likelihoods
}
