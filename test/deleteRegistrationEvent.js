'use strict'

const { deepEqual } = require("assert")
const { DeleteRegistrationEvent } = require("../lib/deleteRegistrationEvent")

describe('Delete Registration Event', () => {
  it('extracts data from token', () => {
      let event = new DeleteRegistrationEvent(httpEvent('MTI6MDB8NDU0MHxhQGIuY3wK'))

      deepEqual(event.timeSlot(), "12:00")
      deepEqual(event.trainNumber(), "4540")
      deepEqual(event.email(), "a@b.c")
  })
})

function httpEvent(token) {
  return {
    resource: `/registration/delete/{${token}}`,
    path: '/registration/delete/token',
    httpMethod: 'GET',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: { token: token },
    stageVariables: null,
    requestContext: {
      resourceId: '3ehr2f',
      resourcePath: `/registration/delete/{${token}}`,
      httpMethod: 'GET',
      extendedRequestId: 'KkIVnHM2joEFh2A=',
      requestTime: '06/Apr/2020:12:30:40 +0000',
      path: `/dev/registration/delete/${token}`,
      accountId: '684411073013',
      protocol: 'HTTP/1.1',
      stage: 'dev',
      domainPrefix: '4uknzoe7m4',
      requestTimeEpoch: 1586176240677,
      requestId: '70989fc4-838a-4b2f-9760-ee4bfeabb732',
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        sourceIp: '79.44.104.245',
        principalOrgId: null,
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:74.0) Gecko/20100101 Firefox/74.0',
        user: null
      },
      domainName: '4uknzoe7m4.execute-api.eu-west-1.amazonaws.com',
      apiId: '4uknzoe7m4'
    },
    body: null,
    isBase64Encoded: false
  }
}