const { deepEqual } = require("assert")
const { from } = require("../../lib/timeSlots")

describe('timeSlots', () => {
  it('returns array of slots in a 10 minutes range', () => {
    let date = new Date("2020-01-01T12:00:00")
    let rangeInMinutes = 10

    let timeSlots = from(date, rangeInMinutes)

    deepEqual(timeSlots, ["12:00", "12:02", "12:04", "12:06", "12:08", "12:10"])
  })

  it('starts from slot containing current time', () => {
    let date = new Date("2020-01-01T12:21:12")
    let rangeInMinutes = 10

    let timeSlots = from(date, rangeInMinutes)

    deepEqual(timeSlots, ["12:20", "12:22", "12:24", "12:26", "12:28", "12:30"])
  })

  it('handles change of hours and day', () => {
    let date = new Date("2020-01-01T23:55:12")
    let rangeInMinutes = 10

    let timeSlots = from(date, rangeInMinutes)

    deepEqual(timeSlots, ["23:54", "23:56", "23:58", "00:00", "00:02", "00:04"])
  })

  it('handles change of hours', () => {
    let date = new Date("2020-01-01T12:55:12")
    let rangeInMinutes = 10

    let timeSlots = from(date, rangeInMinutes)

    deepEqual(timeSlots, ["12:54", "12:56", "12:58", "13:00", "13:02", "13:04"])
  })
})