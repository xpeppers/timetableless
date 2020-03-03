const { equal, deepEqual } = require("assert")
const { Trenitalia } = require("../../lib/trenitalia")

describe('Trenitalia', () => {
  it('train delays', async () => {
    var trenitalia = new Trenitalia()
    var delays = await trenitalia.trainDelays("4640")

    equal(delays.length, 14)
    deepEqual(delays[0].station, "S00228")
    deepEqual(delays[13].station, "S00462")
  })
})
