'use strict'

const registrationRepository = require('./lib/registrations')
const timeSlots = require('./lib/timeSlots')
const trenitalia = require('./lib/trenitalia')

const ONE_HOUR = 60

module.exports.updateDelays = async event => {
  var slots = timeSlots.from(new Date(), ONE_HOUR)
  var registrations = await registrationRepository.forAll(slots)

  registrations.forEach((registration) => {
    var delays = await trenitalia.trainDelays(registration.trainNumber)
    console.log(`Delays for ${registration.trainNumber}: `, delays)

    // TODO: aggiornare il ritardo
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ registrations, slots, event }, null, 2)
  }
}
