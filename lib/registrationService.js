'use strict'

const { slotOf } = require('./timeSlots')

exports.RegistrationService = function RegistrationService(repository, trenitalia, log = console.log) {

  this.addRegistration = async (recipient, train, station) => {
    log("Adding Registration for: ", recipient, train, station)

    let departureTime = await trenitalia.departureTime(train, station)
    log("Departure Time: ", departureTime)

    let timeSlot = formatTime(slotOf(departureTime)).substring(0, 5)
    log("timeSlot: ", timeSlot)

    let alreadyExists = await repository.exists(train, timeSlot)

    if(alreadyExists) {
      await repository.addPersonToNotify(train, timeSlot, recipient)
      return
    }

    await repository.create({
      trainNumber: train,
      departureStation: station,
      peopleToNotify: [recipient],
      timeSlot: timeSlot,
      departureTime: formatTime(departureTime),
      delay: 0
    })
  }

  function formatTime(date) {
    return date.toISOString().split('T')[1].split('.')[0]
  }
}