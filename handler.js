'use strict'

const registrationRepository = require('./lib/registrations')
const timeSlots = require('./lib/timeSlots')
const trenitalia = require('./lib/trenitalia')
const { forEach } = require('./lib/asyncHelper')

const ONE_HOUR = 60

function filterBy(station) {
  return (delays) => delays.filter((delay) => delay.station === station)
}

function getFirstDelay(delaysData) {
  return delaysData[0].delay
}

function update(registration) {
  return delay => {
    if(registration.delay === delay) {
      console.log("Already updated, skipping: ", registration)
      return {}
    }

    return registrationRepository.updateDelay(registration, delay).catch(console.error)
  }
}

function updateDelay(registration) {
  return trenitalia.trainDelays(registration.trainNumber)
    .then(filterBy(registration.departureStation))
    .then(getFirstDelay)
    .then(update(registration))
}

module.exports.updateDelays = async () => {
  var slots = timeSlots.from(new Date(), ONE_HOUR)
  console.log('Slots to query:', slots)
  var registrations = await registrationRepository.forAll(slots)
  console.log('Registrations found:', registrations)
  var updatedRegistrations = await forEach(registrations, updateDelay)
  console.log('Registrations updated:', updatedRegistrations)
}
