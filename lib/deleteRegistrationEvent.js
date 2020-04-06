'use strict'

exports.DeleteRegistrationEvent = function DeleteRegistrationEvent(event) {
  let [timeSlot, trainNumber, email] = parse(event.pathParameters.token)

  this.email = () => email

  this.trainNumber = () => trainNumber

  this.timeSlot = () => timeSlot

  function parse(token) {
    return Buffer.from(token, 'base64').toString('utf-8').split('|')
  }
}