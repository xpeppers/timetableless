'use strict'

const { DeleteRegistrationAction } = require("../lib/deleteRegistrationAction")
const { Token } = require("../lib/token")
const { RegistrationRepository } = require("../lib/registrationRepository")

function headers (redirectTo) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Location': `${process.env.frontend_host}/${redirectTo}`
  }
}

function respond(body) {
  return {
    statusCode: 302,
    body: JSON.stringify({ message: body }),
    headers: headers('delete-successful.html')
  }
}

function error(err) {
  console.log("ERROR: ", err)
  return {
    statusCode: 302,
    body: JSON.stringify({ message: err.message }),
    headers: headers('delete-failed.html')
  }
}

module.exports.handler = async (event) => {
  try {
    const token = Token.decode(event.pathParameters.token)
    const action = new DeleteRegistrationAction(new RegistrationRepository())

    let body = await action.execute(token.trainNumber, token.timeSlot, token.email)

    return respond(body)
  } catch(err) {
    return error(err)
  }
}
