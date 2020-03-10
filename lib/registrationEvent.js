'use strict'

exports.RegistrationEvent = function RegistrationEvent(event) {

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