'use strict'

exports.DynamoDbEvents = function DynamoDbEvents(dynamoDbEvent) {

  const notNull = element => element != null

  const parseElement = (element) => {
    return {
      timeSlot: element.timeSlot.S,
      delay: parseInt(element.delay.N),
      trainNumber: element.trainNumber.S,
      departureStation: element.departureStation.S,
      peopleToNotify: element.peopleToNotify.L.map((item) => item.S),
      departureTime: element.departureTime.S
    }
  }

  const toEvents = (record) => {
    var oldElement = parseElement(record.dynamodb.OldImage)
    var newElement = parseElement(record.dynamodb.NewImage)

    if (oldElement.delay != newElement.delay) {
      return newElement
    }

    return null
  }

  this.delayChanged = () => {
    return dynamoDbEvent.Records
      .map(toEvents)
      .filter(notNull)
  }
}