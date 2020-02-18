var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
const dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

function parseElement(element) {
  return {
    timeSlot: element.timeSlot.S,
    delay: element.delay.S,
    trainNumber: element.trainNumber.S,
    departureStation: element.departureStation.S,
    peopleToNotify: element.peopleToNotify.L.map((item) => item.S),
    departureTime: element.departureTime.S
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
          ProjectionExpression: 'timeSlot, delay, trainNumber, departureStation, peopleToNotify, departureTime'
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

registrations()
.then(console.log)
.catch(console.log)