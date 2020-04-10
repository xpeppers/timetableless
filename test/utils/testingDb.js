'use strict'

const { forEach } = require('../../lib/asyncHelper')
const { DynamoDbClientBuilder } = require("../../lib/dynamoDbClientBuilder")

function TestingDB(dynamoDb = new DynamoDbClientBuilder(true).build()) {
  function parseItem (item) {
    item.peopleToNotify = (item.peopleToNotify) ? item.peopleToNotify.values : []
    return item
  }

  this.cleanUp = () => {
    return this.scanRecords().then(records => forEach(records, this.remove))
  }

  this.scanRecords = () => {
    return new Promise((resolve, reject) => {
      let tableName = `registrations-${process.env.stage}`
      let params = {TableName: tableName}
      dynamoDb.scan(params, function (err, data) {
        if (err) {
          reject(err)
          return
        }

        if (!data || !data.Items) {
          reject(new Error("Data has no Items field"))
          return
        }

        resolve(data.Items.map(parseItem))
      })
    })
  }

  this.remove = (record) => {
    return new Promise((resolve, reject) => {
      let tableName = `registrations-${process.env.stage}`
      var params = {
        TableName: tableName,
        Key: { 'timeSlot': record.timeSlot, 'trainNumber': record.trainNumber }
      }

      dynamoDb.delete(params, function(err) {
        if (err) {
          reject(err)
        } else {
          resolve('')
        }
      })
    }).catch(console.log)
  }
}

module.exports.TestingDB = TestingDB