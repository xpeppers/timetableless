'use strict'

const { forEach } = require('./asyncHelper')

const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

function flatMap(values) {
  return [].concat(...values)
}

function registrationsFor(timeSlot) {
  return new Promise((resolve, reject) => {
    var params = {
      TableName: 'registrations',
      KeyConditionExpression: 'timeSlot = :timeSlot',
      ExpressionAttributeValues: { ':timeSlot': timeSlot }
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

exports.forAll = function forAll(timeSlots) {
  return forEach(timeSlots, registrationsFor).then(flatMap)
}