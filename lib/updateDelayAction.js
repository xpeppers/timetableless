'use strict'

const timeSlots = require('./timeSlots')
const { forEach } = require('./asyncHelper')

exports.UpdateDelayAction = function UpdateDelayAction(registrationRepository, trenitalia, log = console.log) {

  this.execute = async (currentDate, range = 60) => {
    let slots = timeSlots.from(currentDate, range)
    log('Slots to query:', slots)
    let registrations = await registrationRepository.findAll(slots)
    log('Registrations found:', registrations)
    let updatedRegistrations = await forEach(registrations, updateDelay)
    log('Registrations updated:', updatedRegistrations)
  }

  const filterBy = (station) => (delays) => delays.filter((delay) => delay.station === station)

  const getFirstDelay = (delaysData) => delaysData[0].delay

  const update = (registration) => (delay) => {
    if(registration.delay === delay) {
      log("Already updated, skipping: ", registration)
      return registration
    }

    return registrationRepository.updateDelay(registration, delay).catch(console.error)
  }

  const updateDelay = (registration) => trenitalia.trainDelays(registration.trainNumber)
      .then(filterBy(registration.departureStation))
      .then(getFirstDelay)
      .then(update(registration))

}