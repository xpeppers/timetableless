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
  return (delay) => {
    registrationRepository.updateDelay(registration, delay)
    return delay
  }
}

function updateDelay(registration) {
  return trenitalia
    .trainDelays(registration.trainNumber)
    .then(filterBy(registration.departureStation))
    .then(getFirstDelay)
    .then(update(registration))
}

module.exports.updateDelays = async event => {
  var slots = timeSlots.from(new Date(), ONE_HOUR)
  var registrations = await registrationRepository.forAll(slots)

  var delays = await forEach(registrations, updateDelay)

  return {
    statusCode: 200,
    body: JSON.stringify({ registrations, slots, delays, event }, null, 2)
  }
}
