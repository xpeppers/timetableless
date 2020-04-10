
const defaultRegistration = {
  timeSlot: '13:56',
  delay: 1,
  trainNumber: '4640',
  departureStation: 'S00458',
  peopleToNotify: ['a@b.c'],
  departureTime: '13:57:25'
}

module.exports.testDynamoDbEvent = {
  parsed: (delay, registration = defaultRegistration) => {
    return {
      timeSlot: registration.timeSlot,
      delay: delay,
      trainNumber: registration.trainNumber,
      departureStation: registration.departureStation,
      peopleToNotify: registration.peopleToNotify,
      departureTime: registration.departureTime
    }
  },
  full: (oldDelay, newDelay, registration = defaultRegistration) => {
    let record = {
      eventID: 'e6bebd8df5c00a73b99fc0e91d3247ee',
      eventName: 'MODIFY',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'eu-west-1',
      dynamodb: {
        ApproximateCreationDateTime: 1583175055,
        Keys: { timeSlot: { S: registration.timeSlot }, trainNumber: { S: registration.trainNumber } },
        NewImage: {
          delay: { N: newDelay },
          departureStation: { S: registration.departureStation },
          departureTime: { S: registration.departureTime },
          peopleToNotify: { SS: registration.peopleToNotify },
          timeSlot: { S: registration.timeSlot },
          trainNumber: { S: registration.trainNumber }
        },
        OldImage: {
          delay: { N: oldDelay },
          departureStation: { S: registration.departureStation },
          departureTime: { S: registration.departureTime },
          peopleToNotify: { SS: registration.peopleToNotify },
          timeSlot: { S: registration.timeSlot },
          trainNumber: { S: registration.trainNumber }
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
}