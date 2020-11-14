import { qpInit, qpPredict, qpUpdate, qpParamEstimate } from '../dist/index.js'

// import { qpInit, qpPredict, qpUpdate, qpParamEstimate } from './questplus.js'


// Create a QUEST+ object.
let qp = qpInit(
  {
    // Stimulus properties
    stimDomain: {
      intensity: [-3.5, -3, -2.5, -2, -1.5, -1, 0, 1]
    },
    // Psychometric function parameters
    paramDomain: {
      threshold: [-2, -1.5, -1],
      slope: [3.5],
      lowerAsymptote: [0.01],
      lapseRate: [0.01]
    },
    // Possible responses (e.g. 0 – incorrect, 1 – correct)
    outcomeDomain: {
      response: [1, 0]  // FIXME Revert
    }
  }
)

// Which stimulus should we present next?
console.log(qpPredict(qp).nextStim)
// Inform QUEST+ about a response for a given stimulus.
qp = qpUpdate(qp, { intensity: -1.5 }, { response: 1 })

// Which stimulus should we present next?
console.log(qpPredict(qp).nextStim)
// // Response.
// qp = qpUpdate(qp, { intensity: -3.5 }, { response: 0 })

// // Which stimulus should we present next?
// console.log(qpPredict(qp).nextStim)
// // Response.
// qp = qpUpdate(qp, { intensity: -2.5 }, { response: 0 })

// // Which stimulus should we present next?
// console.log(qpPredict(qp).nextStim)

// Let's just stop here and look at the estimated threshold value.
console.log('Threshold estimate: ' + qpParamEstimate(qp))

// Let's have a look at the updates QUEST+ data.
// console.log(qp)
