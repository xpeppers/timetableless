'use strict'

const { slotOf } = require('./timeSlots')

exports.RegistrationService = function RegistrationService(repository, trenitalia, log = console.log, logError = console.log) {

  this.addRegistration = async (recipient, train, station) => {
    try {
      let departureTime = await trenitalia.departureTime(train, station)
      let timeSlot = formatTime(slotOf(departureTime)).substring(0, 5)
      let alreadyExists = await repository.exists(train, timeSlot)

      if(alreadyExists) {
        return await repository.addPersonToNotify(train, timeSlot, recipient)
      }

      let response = await repository.create({
        trainNumber: train,
        departureStation: station,
        peopleToNotify: [recipient],
        timeSlot: timeSlot,
        departureTime: formatTime(departureTime),
        delay: 0
      })

      return `'${recipient}' registered with response: (${response})`
    } catch(e) {
      logError(e)
      throw new Error("Enter valid values")
    }
  }

  function formatTime(date) {
    return date.toISOString().split('T')[1].split('.')[0]
  }
}