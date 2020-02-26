'use strict'

const registrationRepository = require('./lib/registrations')
const timeSlots = require('./lib/timeSlots')
const trenitalia = require('./lib/trenitalia')
const { forEach } = require('./lib/asyncHelper')

const ONE_HOUR = 60

async function updateDelay(registration) {
  var delays = await trenitalia.trainDelays(registration.trainNumber)

  return delays.filter((delay) => delay.station === registration.departureStation)

  // TODO: aggiornare il ritardo
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
