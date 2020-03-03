'use strict'

const { RegistrationRepository } = require('./lib/registrations')
const { Trenitalia } = require('./lib/trenitalia')
const { DynamoDbEvents } = require("./lib/events")
const { UpdateDelayService } = require("./lib/updateDelayService")
const { NotifyDelayService } = require("./lib/notifyDelayService")

module.exports.updateDelays = async () => {
  const service = new UpdateDelayService(new RegistrationRepository(), new Trenitalia())

  await service.update(new Date(), 60)
}

module.exports.notifyDelays = async (event) => {
  var events = new DynamoDbEvents(event)
  const service = new NotifyDelayService()

  await service.sendAll(events.delayChanged())
}
