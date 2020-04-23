'use strict'

const { DynamoDbEvent } = require("../lib/dynamoDbEvent")
const { EmailNotifier } = require("../lib/emailNotifier")
const { NotifyDelayAction } = require("../lib/notifyDelayAction")
const { Trenitalia } = require("../lib/trenitalia")

module.exports.handler = async (event) => {
  console.log(event)
  const events = new DynamoDbEvent(event)
  const action = new NotifyDelayAction(new EmailNotifier('carriere@xpeppers.com'), new Trenitalia())

  let response = await action.execute(events.delayChanged())

  console.log('NotiFyDelaysHandler response: ', response)
}