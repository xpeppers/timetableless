'use strict'

const { DynamoDbClientBuilder } = require("./dynamoDbClientBuilder")

exports.RegistrationRepository = function RegistrationRepository(dynamoDb = new DynamoDbClientBuilder().build(), logError = console.error) {
  const { forEach, flatArray } = require('./asyncHelper')
  const tableName = `registrations-${process.env.stage}`

  this.addPersonToNotify = (trainNumber, timeSlot, recipient) => {
    let params = {
      TableName: tableName,
      Key: { 'timeSlot': timeSlot, 'trainNumber': trainNumber },
      UpdateExpression: 'add peopleToNotify :recipient',
      ExpressionAttributeValues: { ':recipient': recipient },
      ReturnValues: 'UPDATED_NEW'
    }

    dynamoDb.update(params, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve('')
      }
    })
    
    // return registrationFor(trainNumber, timeSlot)
    //   .then(add(recipient))
    //   .then(this.create)
  }

  this.exists = (trainNumber, timeSlot) => {
    return registrationFor(trainNumber, timeSlot)
      .then(registration => registration != null)
  }

  this.findAll = (timeSlots) => {
    return forEach(timeSlots, registrationsFor).then(flatArray)
  }

  this.updateDelay = (registration, delay) => new Promise((resolve, reject) => {
    let params = {
      TableName: tableName,
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

  this.delete = (trainNumber, timeSlot, recipient) => new Promise((resolve, reject) => {
    var params = {
      TableName: tableName,
      Key: { 'timeSlot': timeSlot, 'trainNumber': trainNumber },
      // KeyConditionExpression: 'trainNumber = :trainNumber AND timeSlot = :timeSlot',
      UpdateExpression: 'REMOVE peopleToNotify[0]',
      // ExpressionAttributeValues: { ':p': { 'S': recipient } }
    };

    dynamoDb.update(params, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve('')
      }
    })
  })

  this.create = (registration) => new Promise((resolve, reject) => {
    let parsedRegistration = registration
    parsedRegistration.peopleToNotify = dynamoDb.createSet(registration.peopleToNotify)

    let params = {
      TableName: tableName,
      Item: parsedRegistration
    }

    dynamoDb.put(params, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve(registration)
      }
    })
  })

  function registrationsFor(timeSlot) {
    let params = {
      TableName: tableName,
      KeyConditionExpression: 'timeSlot = :timeSlot',
      ExpressionAttributeValues: { ':timeSlot': timeSlot }
    }
    return query(params)
  }

  function registrationFor(trainNumber, timeSlot) {
    let params = {
      TableName: tableName,
      KeyConditionExpression: 'trainNumber = :trainNumber AND timeSlot = :timeSlot',
      ExpressionAttributeValues: { ':trainNumber': trainNumber, ':timeSlot': timeSlot }
    }

    return query(params).then(getFirstOrNull)
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

  function getFirstOrNull(items) {
    return items.length > 0 ? items[0] : null
  }

  function add(recipient) {
    return (registration) => ({...registration, peopleToNotify: [...registration.peopleToNotify, recipient]})
  }
}
