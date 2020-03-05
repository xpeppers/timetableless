'use strict'

const { deepEqual } = require("assert")
const { forEach, flatArray, flatObjectAttributeBy } = require("../lib/asyncHelper")

describe('Async Helper', () => {
  it('forEach', () => {
    return forEach([1, 2, 3], longSumOne)
      .then(result => {
        deepEqual(result, [2, 3, 4])
      })
  })

  it('flatArray', () => {
    var multipleArray = [[1, 2], [3, 4]]
    deepEqual(flatArray(multipleArray), [1, 2, 3, 4])
  })

  it('flatObjectAttributeBy', () => {
    var firstValue = { train: 'first', people: ['a@b.c', 'd@e.f'] }
    var secondValue = { train: 'second', people: ['d@e.f', 'g@h.i'] }
    var multipleArray = [firstValue, secondValue]

    var resultingArray = [
      { train: 'first', people: 'a@b.c' },
      { train: 'first', people: 'd@e.f' },
      { train: 'second', people: 'd@e.f' },
      { train: 'second', people: 'g@h.i' }
    ]

    deepEqual(flatObjectAttributeBy(multipleArray, 'people'), resultingArray)

  })
})

function longSumOne(value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value + 1), 25)
  })
}
