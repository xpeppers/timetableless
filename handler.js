'use strict'

const { RegistrationRepository } = require('./lib/registrations')
const { Trenitalia } = require('./lib/trenitalia')
const { DynamoDbEvents } = require("./lib/events")
const { UpdateDelayService } = require("./lib/updateDelayService")

module.exports.updateDelays = async () => {
  const service = new UpdateDelayService(new RegistrationRepository(), new Trenitalia())

  await service.update(new Date(), 60)
}

module.exports.notifyDelays = async (event) => {
  var events = new DynamoDbEvents(event)

  console.log('Delay Changed Events:', events.delayChanged())
}
