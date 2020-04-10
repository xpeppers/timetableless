'use strict'

const { SesClientBuilder } = require("../../lib/sesClientBuilder")
const { testDynamoDbEvent } = require("../utils/events")
const { TestingDB } = require("../utils/testingDB")
const DB = new TestingDB()
const { EmailNotifier } = require("../../lib/emailNotifier")
const localClient = new SesClientBuilder(true).build()

describe('Registration', () => {

  beforeEach(async () => {
    await DB.cleanUp()
  })

  it('something', async () => {
    const { Lambda } = require('aws-sdk')
    const lambda = new Lambda({ apiVersion: '2031', region: 'localhost', endpoint: 'http://localhost:3000' })

    const params = {
      FunctionName: 'timetableless-dev-notifyDelays',
      InvocationType: 'Event',
      Payload: JSON.stringify(testDynamoDbEvent.full(1, 4)),
    }

    await lambda.invoke(params).promise()


    // let notifier = new EmailNotifier('carriere@xpeppers.com', localClient)

    // notifier.notify("pi@ppo.it", "123", "S001", 0, "token")
    //   .then(console.log)
    //   .catch(console.error)
  })
})


