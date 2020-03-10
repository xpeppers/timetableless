'use strict'

const { DynamoDbEvent } = require("../lib/dynamoDbEvent")
const { EmailNotifier } = require("../lib/emailNotifier")
const { NotifyDelayService } = require("../lib/notifyDelayService")

module.exports.handler = async (event) => {
  const events = new DynamoDbEvent(event)
  const service = new NotifyDelayService(new EmailNotifier('marco.dallagiacoma@xpeppers.com'))

  await service.sendAll(events.delayChanged())
}