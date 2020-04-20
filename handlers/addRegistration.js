'use strict'

const { RegistrationRepository } = require("../lib/registrationRepository")
const { Trenitalia } = require("../lib/trenitalia")
const { AddRegistrationAction } = require("../lib/addRegistrationAction")
const { AddRegistrationEvent } = require("../lib/addRegistrationEvent")

function headers () {
  return {'Access-Control-Allow-Origin': '*'}
}

function respond() {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'registered' }),
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
  try {
    const registration = new AddRegistrationEvent(event)
    const action = new AddRegistrationAction(new RegistrationRepository(), new Trenitalia())

    await action.execute(registration.email(), registration.trainNumber(), registration.station())

    return respond()
  } catch(err) {
    return error(err)
  }
}
