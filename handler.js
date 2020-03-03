'use strict'

const { RegistrationRepository } = require('./lib/registrations')
const { Trenitalia } = require('./lib/trenitalia')
const { DynamoDbEvents } = require("./lib/events")
const { DelayService } = require("./lib/delayService")

module.exports.updateDelays = async () => {
  const delayService = new DelayService(new RegistrationRepository(), new Trenitalia())

  await delayService.update(new Date(), 60)
}

module.exports.notifyDelays = async (event) => {
  var events = new DynamoDbEvents(event)

  console.log('Event:', events.delayChanged())
}
