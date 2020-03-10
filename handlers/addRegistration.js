'use strict'

const { RegistrationRepository } = require("../lib/registrationRepository")
const { RegistrationService } = require("../lib/registrationService")
const { RegistrationEvent } = require("../lib/registrationEvent")

function respond() {
  return {
    statusCode: 200,
    body: "Registration"
  }
}

module.exports.handler = async (event) => {
  const service = new RegistrationService(new RegistrationRepository())
  let registration = new RegistrationEvent(event)

  return service.addRegistration(registration.email(), registration.trainNumber(), registration.station())
  .catch(console.log)
  .then(respond)
}