'use strict'

const { DynamoDbEvents } = require("../lib/dynamoDbEvents")
const { EmailNotifier } = require("../lib/emailNotifier")
const { NotifyDelayService } = require("../lib/notifyDelayService")

module.exports.handler = async (event) => {
  var events = new DynamoDbEvents(event)
  const service = new NotifyDelayService(new EmailNotifier('marco.dallagiacoma@xpeppers.com'))

  await service.sendAll(events.delayChanged())
}