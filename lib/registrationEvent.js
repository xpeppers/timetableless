'use strict'

exports.RegistrationEvent = function RegistrationEvent(event, log = console.log) {
  log("Captured Event: ", event)

  let parsedBody = JSON.parse(event.body)

  this.email = () => {
    return parsedBody.email
  }

  this.trainNumber = () => {
    return parsedBody.trainNumber
  }

  this.station = () => {
    return parsedBody.station
  }
}