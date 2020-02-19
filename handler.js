'use strict'

const registrations = require('./lib/registrations')
const timeSlots = require('./lib/timeSlots')

module.exports.hello = async event => {
  var slots = timeSlots.from(new Date())
  var all = await registrations.forAll(slots)
  // group by train number in order to make one request foreach station
  return {
    statusCode: 200,
    body: JSON.stringify({ all, event }, null, 2)
  }
}
