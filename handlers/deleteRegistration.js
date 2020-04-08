'use strict'

const { DeleteRegistrationAction } = require("../lib/deleteRegistrationAction")
const { Token } = require("../lib/token")
const { RegistrationRepository } = require("../lib/registrationRepository")

function headers () {
  return {'Access-Control-Allow-Origin': '*'}
}

function respond(body) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: body }),
    headers: headers()
  }
}

function error(err) {
  console.log("ERROR: ", err)
  return {
    statusCode: 400,
    body: JSON.stringify({ message: err.message }),
    headers: headers()
  }
}

module.exports.handler = async (event) => {
  const token = Token.decode(event.pathParameters.token)
  const action = new DeleteRegistrationAction(new RegistrationRepository())

  return action.execute(token.trainNumber, token.timeSlot, token.email)
    .then(respond)
    .catch(error)
}
