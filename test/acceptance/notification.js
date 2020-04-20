'use strict'

const { equal, deepEqual } = require("assert")
const { testDynamoDbEvent } = require("../utils/events")
const { TestingDB } = require("../utils/testingDb")
const { TestingSES } = require("../utils/testingSes")
const { TestingLambda } = require("../utils/testingLambda")
const DB = new TestingDB()
const SES = new TestingSES()
const LAMBDA = new TestingLambda()


describe('Notification', () => {

  beforeEach(async () => {
    SES.cleanUp()
    await DB.cleanUp()
  })

  it('do not notify delays when delay not changed', async () => {
    await LAMBDA.invoke("notifyDelays", testDynamoDbEvent.full(1, 1))

    equal(SES.isReceived(), false)
  })

  it('Notify delays when changed', async () => {
    const registration = {
      timeSlot: '13:56',
      delay: 1,
      trainNumber: '4640',
      departureStation: 'S00458',
      peopleToNotify: ['a@b.c'],
      departureTime: '13:57:25'
    }

    await LAMBDA.invoke("notifyDelays", testDynamoDbEvent.full(1, 4, registration))

    deepEqual(SES.isReceived(), true)
    let message = SES.received()
    deepEqual(message.headers.Source, "carriere@xpeppers.com")
    deepEqual(message.headers.Subject, "News about your train")
    deepEqual(message.headers.ToAddress, "a@b.c")
    deepEqual(message.body, '<p>The train 4640 will leave from station S00458 with a delay of 4 minutes.</p><br /><p style="font-size: 10px;">To unregister, <a href="http://localhost:3001/registration/delete/MTM6NTZ8NDY0MHxhQGIuYw==">click here</a>.</p>')
  })
})


