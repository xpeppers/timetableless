const { deepEqual } = require("assert")
const { from } = require("../lib/timeSlots")

describe('timeSlots', () => {
  it('returns array of slots in a 10 minutes range', () => {
    var date = new Date("2020-01-01T12:00:00")
    var rangeInMinutes = 10

    var timeSlots = from(date, rangeInMinutes)

    deepEqual(timeSlots, ["12:00", "12:02", "12:04", "12:06", "12:08", "12:10"])
  })
})