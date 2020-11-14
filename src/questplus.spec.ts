import { _genLikelihoods, qpInit, qpPredict, qpUpdate, qpParamEstimate } from './questplus';

// describe('_genLikelihoods', () => {
//   it('works', () => {
//     expect(() => [1, 2, 3]
//     );
//     _genLikelihoods(
//       {
//         intensity: [1, 2, 3]
//       },
//       {
//         threshold: [1, 2, 3],
//         slope: 3.5,
//         lowerAsymptote: 0.01,
//         lapseRate: 0.01
//       }
//     ).print()
//     const foo = _genLikelihoods(
//       {
//         intensity: [1, 2, 3]
//       },
//       {
//         threshold: [1, 2, 3],
//         slope: 3.5,
//         lowerAsymptote: 0.01,
//         lapseRate: 0.01
//       }
//     )
//     console.log(foo.shape)
//     foo.slice(
//       [0, 0, 2, 0, 0, 0],
//       [1, 3, 1, 1, 1, 1]
//     ).squeeze().print()

//   });
// });


describe('qpInit', () => {
  it('works', () => {
    expect(() => [1, 2, 3]
    );
    let qp = qpInit(
      {
        stimDomain: {
          // intensity: [-3.5, -3, -2.5, -2, -1.5, -1, 0, 1]
          intensity: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        },
        paramDomain: {
          // threshold: [-3.5, -3, -2.5, -2, -1.5, -1, 0, 1],
          threshold: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          slope: [3.5],
          lowerAsymptote: [0.01],
          lapseRate: [0.01]
        },
        outcomeDomain: {
          response: [1, 0]
        },
        // prior: [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
        prior: null,
        stimScale: 'linear'
      }
    );

    // console.log(qpPredict(qp).nextStim)
    // qp = qpUpdate(qp, { intensity: -2 }, { response: 1 })
    // console.log(qpPredict(qp).nextStim)
    // qp = qpUpdate(qp, { intensity: -3.5 }, { response: 0 })
    // console.log(qpPredict(qp).nextStim)
    // qp = qpUpdate(qp, { intensity: -2.5 }, { response: 0 })
    // console.log(qpPredict(qp).nextStim)
    // console.log(qp)
    // console.log(qpParamEstimate(qp))
    let nextStim
    nextStim = qpPredict(qp).nextStim
    console.log(nextStim)

    qp = qpUpdate(qp, nextStim, { response: 0 })
    nextStim = qpPredict(qp).nextStim
    console.log(nextStim)

    qp = qpUpdate(qp, nextStim, { response: 0 })
    nextStim = qpPredict(qp).nextStim
    console.log(nextStim)

    qp = qpUpdate(qp, nextStim, { response: 1 })
    nextStim = qpPredict(qp).nextStim
    console.log(nextStim)

    qp = qpUpdate(qp, nextStim, { response: 1 })
    nextStim = qpPredict(qp).nextStim
    console.log(nextStim)

    qp = qpUpdate(qp, nextStim, { response: 1 })
    nextStim = qpPredict(qp).nextStim
    console.log(nextStim)

    qp = qpUpdate(qp, nextStim, { response: 0 })
    nextStim = qpPredict(qp).nextStim
    console.log(nextStim)

    qp = qpUpdate(qp, nextStim, { response: 1 })
    nextStim = qpPredict(qp).nextStim
    console.log(nextStim)


    console.log(qpParamEstimate(qp))
  });
});
