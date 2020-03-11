'use strict'

exports.DynamoDbClientBuilder = function DynamoDbClientBuilder(isOffline = process.env.IS_OFFLINE) {
  const options = { region: "localhost", endpoint: "http://localhost:3333"}

  this.build = () => {
    const AWS = require('aws-sdk')
    return new AWS.DynamoDB.DocumentClient(isOffline ? options : null)
  }
}