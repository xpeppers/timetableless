'use strict'

exports.RegistrationEvent = function RegistrationEvent(event) {
  console.log("Registration Event: ", event)

  this.email = () => {
    return ""
  }

  this.trainNumber = () => {
    return ""
  }

  this.station = () => {
    return ""
  }
}