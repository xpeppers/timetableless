'use strict'

const { equal } = require("assert")
const { AddRegistrationEvent } = require("../../lib/addRegistrationEvent")
const stubLog = () => {}

describe('Registration Event', () => {
  it('parses registration details', () => {
      let fullAddRegistrationEvent = event(registration("a@b.c", "1", "S01"))
      let updatedEvent = new AddRegistrationEvent(fullAddRegistrationEvent, stubLog)

      equal(updatedEvent.email(), "a@b.c")
      equal(updatedEvent.trainNumber(), "1")
      equal(updatedEvent.station(), "S01")
  })
})

function registration(email, trainNumber, station) {
  return {email, trainNumber, station}
}

function event(registrationRequest) {
  return {
    resource: '/registration',
    path: '/registration',
    httpMethod: 'POST',
    headers: {
      Accept: '*/*',
      'CloudFront-Forwarded-Proto': 'https',
      'CloudFront-Is-Desktop-Viewer': 'true',
      'CloudFront-Is-Mobile-Viewer': 'false',
      'CloudFront-Is-SmartTV-Viewer': 'false',
      'CloudFront-Is-Tablet-Viewer': 'false',
      'CloudFront-Viewer-Country': 'IT',
      'content-type': 'application/x-www-form-urlencoded',
      Host: 'u9myp90685.execute-api.eu-west-1.amazonaws.com',
      'User-Agent': 'curl/7.64.1',
      Via: '2.0 13234883000891123bda3fd8d846da9d.cloudfront.net (CloudFront)',
      'X-Amz-Cf-Id': 'oEbzWfKyaav6Tb9yAtTkJXX849jlkMFcOqXIumA_Z3Y9RMrCVhRWwA==',
      'X-Amzn-Trace-Id': 'Root=1-5e6795d2-da3b9ec698612ba85ec4fe92',
      'X-Forwarded-For': '95.248.104.43, 64.252.144.79',
      'X-Forwarded-Port': '443',
      'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
      Accept: [ '*/*' ],
      'CloudFront-Forwarded-Proto': [ 'https' ],
      'CloudFront-Is-Desktop-Viewer': [ 'true' ],
      'CloudFront-Is-Mobile-Viewer': [ 'false' ],
      'CloudFront-Is-SmartTV-Viewer': [ 'false' ],
      'CloudFront-Is-Tablet-Viewer': [ 'false' ],
      'CloudFront-Viewer-Country': [ 'IT' ],
      'content-type': [ 'application/x-www-form-urlencoded' ],
      Host: [ 'u9myp90685.execute-api.eu-west-1.amazonaws.com' ],
      'User-Agent': [ 'curl/7.64.1' ],
      Via: [
        '2.0 13234883000891123bda3fd8d846da9d.cloudfront.net (CloudFront)'
      ],
      'X-Amz-Cf-Id': [ 'oEbzWfKyaav6Tb9yAtTkJXX849jlkMFcOqXIumA_Z3Y9RMrCVhRWwA==' ],
      'X-Amzn-Trace-Id': [ 'Root=1-5e6795d2-da3b9ec698612ba85ec4fe92' ],
      'X-Forwarded-For': [ '95.248.104.43, 64.252.144.79' ],
      'X-Forwarded-Port': [ '443' ],
      'X-Forwarded-Proto': [ 'https' ]
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
      resourceId: 'lsaw8z',
      resourcePath: '/registration',
      httpMethod: 'POST',
      extendedRequestId: 'JLRY-GmFjoEF_Hw=',
      requestTime: '10/Mar/2020:13:27:46 +0000',
      path: '/dev/registration',
      accountId: '684411073013',
      protocol: 'HTTP/1.1',
      stage: 'dev',
      domainPrefix: 'u9myp90685',
      requestTimeEpoch: 1583846866987,
      requestId: '7e7a2f66-1a2d-4e3e-a7e8-bdac4b4bae2a',
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        sourceIp: '95.248.104.43',
        principalOrgId: null,
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'curl/7.64.1',
        user: null
      },
      domainName: 'u9myp90685.execute-api.eu-west-1.amazonaws.com',
      apiId: 'u9myp90685'
    },
    body: JSON.stringify(registrationRequest),
    isBase64Encoded: false
  }
}