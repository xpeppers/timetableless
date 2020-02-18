'use strict'

const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'})
const dynamoDb = new AWS.DynamoDB.DocumentClient()

function flatMap(values) {
  return [].concat(...values)
}

function registrationsFor(timeSlot) {
  return new Promise((resolve, reject) => {
    var params = {
      TableName : "registrations",
      KeyConditionExpression: "timeSlot = :timeSlot",
      ExpressionAttributeValues: { ":timeSlot": timeSlot }
    }

    dynamoDb.query(params, function (err, data) {
      if (err) reject(err)
      if (!data || !data.Items) {
        reject(data)
      } else {
        resolve(data.Items)
      }
    })
  })
}

Promise.all([
  registrationsFor("12:02"),
  registrationsFor("12:16")
])
  .then(flatMap)
  .then(console.log)
  .catch(console.log)
  .then(() => 'DONE')