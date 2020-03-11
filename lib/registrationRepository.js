'use strict'

exports.RegistrationRepository = function RegistrationRepository() {
  const { forEach, flatArray } = require('./asyncHelper')
  const AWS = require('aws-sdk')
  const dynamoDb = new AWS.DynamoDB.DocumentClient()

  this.exists = (trainNumber, timeSlot) => Promise.resolve(false)
  this.addPersonToNotify = (trainNumber, timeSlot) => Promise.resolve()

  this.findAll = (timeSlots) => forEach(timeSlots, registrationsFor).then(flatArray)

  this.updateDelay = (registration, delay) => new Promise((resolve, reject) => {
    let params = {
      TableName: 'registrations',
      Key: { 'timeSlot': registration.timeSlot, 'trainNumber': registration.trainNumber },
      UpdateExpression: 'set delay = :delay',
      ExpressionAttributeValues: { ':delay': delay },
      ReturnValues: 'UPDATED_NEW'
    }

    dynamoDb.update(params, function(err) {
        if (err) {
          reject(err)
        } else {
          resolve({ ...registration, delay })
        }
    })
  })

  this.create = (registration) =>  new Promise((resolve, reject) => {
    let params = { TableName: 'registrations', Item: registration }

    dynamoDb.put(params, function(err, addedRegistration) {
      if (err) {
        reject(err)
      } else {
        resolve(addedRegistration)
      }
    })
  })

  function registrationsFor(timeSlot) {
    return new Promise((resolve, reject) => {
      let params = {
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
}