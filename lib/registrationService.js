'use strict'

const { slotOf } = require('./timeSlots')

exports.RegistrationService = function RegistrationService(repository, trenitalia, log = console.log, error = console.log) {

  this.addRegistration = async (recipient, train, station) => {
    log("Adding Registration for: ", recipient, train, station)

    let departureTime = await trenitalia.departureTime(train, station)
    log("Departure Time: ", departureTime)

    let timeSlot = slotOf(departureTime)
    log("TimeSlot: ", timeSlot)

    await repository.create({
      trainNumber: train,
      departureStation: station,
      peopleToNotify: [recipient],
      timeSlot: timeFrom(timeSlot).substring(0, 5),
      departureTime: timeFrom(departureTime),
      delay: 0
    })
  }

  function timeFrom(date) {
    return date.toISOString().split('T')[1].split('.')[0]
  }
}