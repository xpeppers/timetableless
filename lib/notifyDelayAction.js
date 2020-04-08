'use strict'

const { forEach, flatObjectByAttribute } = require('./asyncHelper')
const { Token } = require("./token")

exports.NotifyDelayAction = function NotifyDelayAction(notifier, log = console.log, error = console.log) {

  this.execute = async (registrations) => {
    log('Delay Changed Events:', registrations)

    let singleRegistrations = flatObjectByAttribute(registrations, 'peopleToNotify')

    return forEach(singleRegistrations, notify, error)
      .then(log)
  }

  function notify(registration) {
    let token = Token.encode(registration.timeSlot, registration.trainNumber, registration.peopleToNotify)
    return notifier.notify(registration.peopleToNotify, registration.trainNumber, registration.departureStation, registration.delay, token)
  }
}
