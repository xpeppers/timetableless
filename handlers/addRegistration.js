'use strict'

const { RegistrationRepository } = require("../lib/registrationRepository")
const { Trenitalia } = require("../lib/trenitalia")
const { RegistrationService } = require("../lib/registrationService")
const { RegistrationEvent } = require("../lib/registrationEvent")

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
  const service = new RegistrationService(new RegistrationRepository(), new Trenitalia())
  const registration = new RegistrationEvent(event)

  return service.addRegistration(registration.email(), registration.trainNumber(), registration.station())
  .then(respond)
  .catch(error)
}