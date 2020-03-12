'use strict'

const { RegistrationRepository } = require("../lib/registrationRepository")
const { Trenitalia } = require("../lib/trenitalia")
const { RegistrationService } = require("../lib/registrationService")
const { RegistrationEvent } = require("../lib/registrationEvent")

function respond(body) {
  return {
    statusCode: 200,
    body: body
  }
}

function error(err) {
  console.log("ERROR: ", err)
  return {
    statusCode: 400,
    body: err.message
  }
}

module.exports.handler = async (event) => {
  const service = new RegistrationService(new RegistrationRepository(), new Trenitalia())
  const registration = new RegistrationEvent(event)

  return service.addRegistration(registration.email(), registration.trainNumber(), registration.station())
  .then(respond)
  .catch(error)
}