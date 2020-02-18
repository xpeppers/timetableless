'use strict';

var AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

function parseElement(element) {
  return {
    timeSlot: element.timeSlot.S,
    delay: element.delay.S,
    trainNumber: element.trainNumber.S,
    peopleToNotify: element.peopleToNotify.L.map((item) => item.S),
    departureTime: element.departureTime.S,
    departureStation: element.departureStation.S
  }
}

function registrations() {
  return new Promise((resolve, reject) => {
    var tableName = 'registrations'
    var params = {
      RequestItems: {
        'registrations': {
          Keys: [
            {'timeSlot': {S: '12:02'}},
            {'timeSlot': {S: '12:16'}}
          ],
          ProjectionExpression: 'timeSlot, trainNumber, delay, departureStation, departureTime, peopleToNotify'
        }
      }
    };
    dynamoDb.batchGetItem(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data.Responses[tableName].map(parseElement))
      }
    })
  })
}

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go timetableless v1.0! Your function executed successfully!',
        registrations: await registrations(),
        input: event
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
