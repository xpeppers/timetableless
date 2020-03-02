'use strict'

const registrationRepository = require('./lib/registrations')
const timeSlots = require('./lib/timeSlots')
const trenitalia = require('./lib/trenitalia')
const { forEach } = require('./lib/asyncHelper')

const ONE_HOUR = 60

const peekLog = (name) => (value) => {
  console.log(name, registration)
  return value
}

function filterBy(station) {
  return (delays) => delays.filter((delay) => delay.station === station)
}

function getFirstDelay(delaysData) {
  return delaysData[0].delay
}

function update(registration) {
  return (delay) => registrationRepository.updateDelay(registration, delay).catch(console.error).then(() => {})
}

function updateDelay(registration) {
  return trenitalia
    .trainDelays(registration.trainNumber)
    .then(filterBy(registration.departureStation))
    .then(getFirstDelay)
    .then(update(registration))
    .then(peekLog('Updated Registration: '))
}

module.exports.updateDelays = async event => {
  var slots = timeSlots.from(new Date(), ONE_HOUR)
  var registrations = await registrationRepository.forAll(slots)
  var updatedRegistrations = await forEach(registrations, updateDelay)

  return {
    statusCode: 200,
    body: JSON.stringify({ updatedRegistrations, slots, event }, null, 2)
  }
}
