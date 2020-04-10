'use strict'

const { Lambda } = require('aws-sdk')

const TestingLambda = function() {
  this.invoke = (functionName, payload) => {
    const lambda = new Lambda({ apiVersion: '2031', region: 'localhost', endpoint: 'http://localhost:3000' })
    return lambda.invoke({
      FunctionName: `timetableless-dev-${functionName}`,
      InvocationType: 'Event',
      Payload: JSON.stringify(payload),
    }).promise()
  }
}

module.exports.TestingLambda = TestingLambda