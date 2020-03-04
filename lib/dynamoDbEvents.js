'use strict'

exports.DynamoDbEvents = function DynamoDbEvents(dynamoDbEvent) {

  this.delayChanged = () => {
    return dynamoDbEvent.Records
      .map(toEvents)
      .filter(notNull)
  }

  function notNull(element) {
    return  element != null
  }

  function parseElement(element) {
    return {
      timeSlot: element.timeSlot.S,
      delay: parseInt(element.delay.N),
      trainNumber: element.trainNumber.S,
      departureStation: element.departureStation.S,
      peopleToNotify: element.peopleToNotify.L.map((item) => item.S),
      departureTime: element.departureTime.S
    }
  }

  function toEvents(record) {
    try {
      var oldElement = parseElement(record.dynamodb.OldImage)
    } catch(err) {
      return null
    }

    var newElement = parseElement(record.dynamodb.NewImage)

    if (oldElement.delay != newElement.delay) {
      return newElement
    }

    return null
  }
}