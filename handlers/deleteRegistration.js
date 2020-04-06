'use strict'

const { DeleteRegistrationAction } = require("../lib/deleteRegistrationAction")
const { DeleteRegistrationEvent } = require("../lib/deleteRegistrationEvent")
const { RegistrationRepository } = require("../lib/registrationRepository")

function headers () {
  return {'Access-Control-Allow-Origin': '*'}
}

function respond(body) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: body }),
    headers: headers()
  }
}

function error(err) {
  console.log("ERROR: ", err)
  return {
    statusCode: 400,
    body: JSON.stringify({ message: err.message }),
    headers: headers()
  }
}

module.exports.handler = async (event) => {
  const deleteEvent = new DeleteRegistrationEvent(event)
  const action = new DeleteRegistrationAction(new RegistrationRepository())

  return action.execute(deleteEvent.trainNumber(), deleteEvent.timeSlot(), deleteEvent.email())
  .then(respond)
  .catch(error)
}