'use strict'

const { deepEqual } = require("assert")
const { DynamoDbEvent } = require("../lib/dynamoDbEvent")

describe('Delete Registration Event', () => {
  it('empty list when delay is not changed', () => {
      let updatedEvent = new DynamoDbEvent(dynamoDbEvent('1', '1'))

      deepEqual(updatedEvent.delayChanged(), [])
  })
})

function parsedEvent(delay) {
  return {
    timeSlot: '13:56',
    delay: delay,
    trainNumber: '4640',
    departureStation: 'S00458',
    peopleToNotify: ['a@b.c'],
    departureTime: '13:57:25'
  }
}

function dynamoDbEvent(oldDelay, newDelay) {
  let record = {
    eventID: 'e6bebd8df5c00a73b99fc0e91d3247ee',
    eventName: 'MODIFY',
    eventVersion: '1.1',
    eventSource: 'aws:dynamodb',
    awsRegion: 'eu-west-1',
    dynamodb: {
      ApproximateCreationDateTime: 1583175055,
      Keys: { timeSlot: { S: '13:56' }, trainNumber: { S: '4640' } },
      NewImage: {
        departureTime: { S: '13:57:25' },
        delay: { N: newDelay },
        timeSlot: { S: '13:56' },
        departureStation: { S: 'S00458' },
        trainNumber: { S: '4640' },
        peopleToNotify: { L: [{ S: 'a@b.c' }] }
      },
      OldImage: {
        departureTime: { S: '13:57:24' },
        delay: { N: oldDelay },
        timeSlot: { S: '13:56' },
        departureStation: { S: 'S00458' },
        trainNumber: { S: '4640' },
        peopleToNotify: { L: [{ S: 'a@b.c' }] }
      },
      SequenceNumber: '56951300000000004332165461',
      SizeBytes: 272,
      StreamViewType: 'NEW_AND_OLD_IMAGES'
    },
    eventSourceARN: 'arn:aws:dynamodb:eu-west-1:684411073013:table/registrations/stream/2020-03-02T13:40:42.816'
  }

  if(oldDelay === null) {
    delete(record.dynamodb.OldImage)
  }

  return {Records: [record]}
}