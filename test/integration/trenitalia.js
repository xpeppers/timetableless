const { equal, deepEqual } = require("assert")
const { Trenitalia } = require("../../lib/trenitalia")

describe('Trenitalia', function () {
  this.timeout(5000)

  it('train delays', async () => {
    let trenitalia = new Trenitalia()
    let delays = await trenitalia.trainDelays("4640")

    equal(delays.length, 14)
    deepEqual(delays[0].station, "S00228")
    deepEqual(delays[13].station, "S00462")
  })

  it('train departure time', async () => {
    let trenitalia = new Trenitalia()
    let departureTime = await trenitalia.departureTime('4640', 'S00460')

    equal(departureTime.toISOString().split('T')[1], `05:21:00.000Z`)
  })

  it('train-station info', async () => {
    let trenitalia = new Trenitalia()
    let info = await trenitalia.trainStationInfo('4640', 'S00460')

    deepEqual(info, { trainName: '4640 - TORINO STURA', stationName: 'BALDICHIERI'})
  })

  it('autocomplete station', async () => {
    let trenitalia = new Trenitalia()
    let info = await trenitalia.autocompleteStation('BALDICH')

    equal(info, 'BALDICHIERI|S00460\n')
  })
})
