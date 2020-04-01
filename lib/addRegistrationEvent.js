'use strict'

exports.AddRegistrationEvent = function AddRegistrationEvent(event, log = console.log) {
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