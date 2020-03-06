'use strict'

const { RegistrationRepository } = require("../lib/registrationRepository")
const { RegistrationService } = require("../lib/registrationService")
const { RegistrationEvent } = require("../lib/registrationEvent")

module.exports.handler = async (event) => {
  const service = new RegistrationService(new RegistrationRepository())
  let registration = new RegistrationEvent(event)

  await service.addRegistration(registration.email(), registration.trainNumber(), registration.station())
}