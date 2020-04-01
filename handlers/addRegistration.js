'use strict'

const { RegistrationRepository } = require("../lib/registrationRepository")
const { Trenitalia } = require("../lib/trenitalia")
const { AddRegistrationAction } = require("../lib/addRegistrationAction")
const { AddRegistrationEvent } = require("../lib/addregistrationEvent")

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
  const registration = new AddRegistrationEvent(event)
  const action = new AddRegistrationAction(new RegistrationRepository(), new Trenitalia())

  return action.execute(registration.email(), registration.trainNumber(), registration.station())
  .then(respond)
  .catch(error)
}