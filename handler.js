'use strict'

const { RegistrationRepository } = require('./lib/registrationRepository')
const { Trenitalia } = require('./lib/trenitalia')
const { DynamoDbEvents } = require("./lib/dynamoDbEvents")
const { EmailNotifier } = require("./lib/emailNotifier")
const { UpdateDelayService } = require("./lib/updateDelayService")
const { NotifyDelayService } = require("./lib/notifyDelayService")

module.exports.updateDelays = async () => {
  const service = new UpdateDelayService(new RegistrationRepository(), new Trenitalia())

  await service.update(new Date(), 60)
}

module.exports.notifyDelays = async (event) => {
  var events = new DynamoDbEvents(event)
  const service = new NotifyDelayService(new EmailNotifier('marco.dallagiacoma@xpeppers.com'))

  await service.sendAll(events.delayChanged())
}
