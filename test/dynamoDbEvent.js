'use strict'

const { deepEqual } = require("assert")
const { DynamoDbEvent } = require("../lib/dynamoDbEvent")
const { testDynamoDbEvent } = require("./utils/events")

describe('DynamoDb Event', () => {
  it('empty list when delay is not changed', () => {
      let updatedEvent = new DynamoDbEvent(testDynamoDbEvent.full('1', '1'))

      deepEqual(updatedEvent.delayChanged(), [])
  })

  it('list of elements with updated delay', () => {
    let updatedEvent = new DynamoDbEvent(testDynamoDbEvent.full(1, 2))

    deepEqual(updatedEvent.delayChanged(), [testDynamoDbEvent.parsed('2')])
  })

  it('skip new items', () => {
    let newInsertedEvent = testDynamoDbEvent.full(null, 1)
    let events = new DynamoDbEvent(newInsertedEvent)

    deepEqual(events.delayChanged(), [])
  })
})