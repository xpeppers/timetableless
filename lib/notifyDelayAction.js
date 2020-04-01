'use strict'

const { forEach, flatObjectByAttribute } = require('./asyncHelper')

exports.NotifyDelayAction = function NotifyDelayAction(notifier, log = console.log, error = console.log) {

  this.execute = async (registrations) => {
    log('Delay Changed Events:', registrations)

    let singleRegistrations = flatObjectByAttribute(registrations, 'peopleToNotify')

    return forEach(singleRegistrations, notify, error)
      .then(log)
  }

  function notify(registration) {
    return notifier.notify(registration.peopleToNotify, registration.trainNumber, registration.departureStation, registration.delay)
  }
}