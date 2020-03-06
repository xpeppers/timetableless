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

  it('train departure time', async () => {
    var trenitalia = new Trenitalia()
    var departureTime = await trenitalia.departureTime('4640', 'S00460')

    equal(departureTime.toISOString(), '2020-03-06T06:21:00.000Z')
  })
})
