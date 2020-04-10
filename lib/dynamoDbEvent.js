'use strict'

exports.DynamoDbEvent = function DynamoDbEvent(dynamoDbEvent) {

  this.delayChanged = () => {
    return dynamoDbEvent.Records
      .map(toDelayChangedEvent)
      .filter(notNull)
  }

  function notNull(element) {
    return  element != null
  }

  function toDelayChangedEvent(record) {
    try {
      return buildDelayChangedEvent(record)
    } catch(err) {
      return null
    }
  }

  function buildDelayChangedEvent(record) {
    let oldElement = parseElement(record.dynamodb.OldImage)
    let newElement = parseElement(record.dynamodb.NewImage)

    if (oldElement.delay != newElement.delay) {
      return newElement
    }

    return null
  }

  function parseElement(element) {
    return {
      timeSlot: element.timeSlot.S,
      delay: parseInt(element.delay.N),
      trainNumber: element.trainNumber.S,
      departureStation: element.departureStation.S,
      peopleToNotify: element.peopleToNotify.SS,
      departureTime: element.departureTime.S
    }
  }
}