'use strict'

const { forEach, flatObjectByAttribute } = require('./asyncHelper')

exports.NotifyDelayService = function NotifyDelayService(notifier, log = console.log, error = console.log) {

  this.sendAll = async (registrations) => {
    log('Delay Changed Events:', registrations)

    let singleRegistrations = flatObjectByAttribute(registrations, 'peopleToNotify')

    await forEach(singleRegistrations, notify)
      .then(log)
      .catch(error)
  }

  function notify(registration) {
    return notifier.notify(registration.peopleToNotify, registration.trainNumber, registration.departureStation, registration.delay)
  }
}