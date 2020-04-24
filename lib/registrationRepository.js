'use strict'

const { DynamoDbClientBuilder } = require("./dynamoDbClientBuilder")

exports.RegistrationRepository = function RegistrationRepository(logError, dynamoDb = new DynamoDbClientBuilder().build()) {
  const { forEach, flatArray } = require('./asyncHelper')
  const tableName = `registrations-${process.env.stage}`

  this.addPersonToNotify = (trainNumber, timeSlot, recipient) => new Promise((resolve, reject) => {
    let params = {
      TableName: tableName,
      Key: { 'timeSlot': timeSlot, 'trainNumber': trainNumber },
      UpdateExpression: 'ADD peopleToNotify :recipient',
      ExpressionAttributeValues: { ':recipient': dynamoDb.createSet([recipient]) },
      ReturnValues: 'UPDATED_NEW'
    }

    dynamoDb.update(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve('')
      }
    })
  })

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

  this.delete = async function(trainNumber, timeSlot, recipient) {
    let registration = await registrationFor(trainNumber, timeSlot)

    if(registration.peopleToNotify.length === 1 && registration.peopleToNotify[0] === recipient) {
      return await removeRecord(trainNumber, timeSlot)
    } else if(registration.peopleToNotify.includes(recipient)) {
      return await removePerson(trainNumber, timeSlot, recipient)
    }
  }

  this.create = (registration) => new Promise((resolve, reject) => {
    let parsedRegistration = Object.assign({}, registration)
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

  function removeRecord(trainNumber, timeSlot) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: tableName,
        Key: { 'timeSlot': timeSlot, 'trainNumber': trainNumber }
      }

      dynamoDb.delete(params, function(err) {
        if (err) {
          reject(err)
        } else {
          resolve('')
        }
      })
    })
  }

  function removePerson(trainNumber, timeSlot, recipient) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: tableName,
        Key: { 'timeSlot': timeSlot, 'trainNumber': trainNumber },
        UpdateExpression: 'DELETE peopleToNotify :recipient',
        ExpressionAttributeValues: { ':recipient': dynamoDb.createSet([recipient]) },
        ReturnValues: 'UPDATED_NEW'
      };

      dynamoDb.update(params, function(err) {
        if (err) {
          reject(err)
        } else {
          resolve('')
        }
      })
    })
  }

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

        resolve(data.Items.map(parseItem))
      })
    })
  }

  function getFirstOrNull(items) {
    return items.length > 0 ? items[0] : null
  }

  function parseItem (item) {
    item.peopleToNotify = (item.peopleToNotify) ? item.peopleToNotify.values : []
    return item
  }
}
