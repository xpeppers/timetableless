'use strict'

exports.RegistrationRepository = function RegistrationRepository(logError = console.error) {
  const { forEach, flatArray } = require('./asyncHelper')
  const AWS = require('aws-sdk')
  const dynamoDb = new AWS.DynamoDB.DocumentClient()

  this.addPersonToNotify = (trainNumber, timeSlot) => Promise.resolve()

  this.exists = (trainNumber, timeSlot) => registrationFor(trainNumber, timeSlot).then(items => items.length > 0)

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
    let params = {
      TableName: 'registrations',
      KeyConditionExpression: 'timeSlot = :timeSlot',
      ExpressionAttributeValues: { ':timeSlot': timeSlot }
    }
    return query(params)
  }

  function registrationFor(trainNumber, timeSlot) {
    let params = {
      TableName: 'registrations',
      KeyConditionExpression: 'trainNumber = :trainNumber AND timeSlot = :timeSlot',
      ExpressionAttributeValues: { ':trainNumber': trainNumber, ':timeSlot': timeSlot }
    }
    return query(params)
  }

  function query(params) {
    return new Promise((resolve, reject) => {
      dynamoDb.query(params, function (err, data) {
        if (err) {
          logError(err)
          reject(err)
          return
        }

        if (!data || !data.Items) {
          logError(err)
          reject(data)
          return
        }

        resolve(data.Items)
      })
    })
  }
}