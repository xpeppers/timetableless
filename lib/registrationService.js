'use strict'

const { slotOf } = require('./timeSlots')

exports.RegistrationService = function RegistrationService(repository, trenitalia, log = console.log, error = console.log) {

  this.addRegistration = async (recipient, train, station) => {

    let departureTime = await trenitalia.departureTime(train, station)
    let timeSlot = slotOf(departureTime)

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