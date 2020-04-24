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
    deepEqual(message.headers.Subject, "Aggiornamenti sul tuo treno")
    deepEqual(message.headers.ToAddress, "a@b.c")
    deepEqual(message.body, "<p>Il Treno '4640 - TORINO STURA' lascerà la stazione 'VILLANOVA' con un ritardo di 4 minuti.</p><br /><br /><p style=\"font-size: 10px;\">Per eliminare la registrazione, <a href=\"http://localhost:3001/registration/delete/MTM6NTZ8NDY0MHxhQGIuYw==\">clicca qui</a>.</p>")
  })
})


