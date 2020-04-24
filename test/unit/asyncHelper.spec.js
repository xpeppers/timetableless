'use strict'

const { deepEqual } = require("assert")
const { forEach, flatArray, flatObjectByAttribute } = require("../../lib/asyncHelper")

describe('Async Helper', () => {
  it('forEach', () => {
    return forEach([1, 2, 3], longSumOne)
      .then(result => {
        deepEqual(result, [2, 3, 4])
      })
  })

  it('flatArray', () => {
    let multipleArray = [[1, 2], [3, 4]]
    deepEqual(flatArray(multipleArray), [1, 2, 3, 4])
  })

  it('flatObjectByAttribute', () => {
    let firstValue = { train: 'first', people: ['a@b.c', 'd@e.f'] }
    let secondValue = { train: 'second', people: ['d@e.f', 'g@h.i'] }
    let multipleArray = [firstValue, secondValue]

    let resultingArray = [
      { train: 'first', people: 'a@b.c' },
      { train: 'first', people: 'd@e.f' },
      { train: 'second', people: 'd@e.f' },
      { train: 'second', people: 'g@h.i' }
    ]

    deepEqual(flatObjectByAttribute(multipleArray, 'people'), resultingArray)

  })

  it('forEach one has error', () => {
    return forEach([1, -1, 3], longSumOne, () => {})
      .then(result => {
        deepEqual(result, [2, 4])
      })
  })
})

function longSumOne(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(value === -1) {
        reject("NEGATIVES NOT ALLOWED")
      } else {
        resolve(value + 1)
      }
    }, 25)
  })
}
