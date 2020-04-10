'use strict'

exports.SesClientBuilder = function SesClientBuilder(isOffline = process.env.IS_OFFLINE) {
  const options = { region: "localhost", endpoint: "http://localhost:9001"}

  this.build = () => {
    const AWS = require('aws-sdk')
    return new AWS.SES(isOffline ? options : null)
  }
}
