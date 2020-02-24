'use strict'

const registrationRepository = require('./lib/registrations')
const timeSlots = require('./lib/timeSlots')
const trenitalia = require('./lib/trenitalia')

const ONE_HOUR = 60

module.exports.updateDelays = async event => {
  var slots = timeSlots.from(new Date(), ONE_HOUR)
  var registrations = await registrationRepository.forAll(slots)

  var delays = registrations.map((registration) => {
    return await trenitalia.trainDelays(registration.trainNumber)
    // TODO: aggiornare il ritardo
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ registrations, slots, delays, event }, null, 2)
  }
}
