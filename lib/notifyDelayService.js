'use strict'


const { forEach, flatObjectAttributeBy } = require('./asyncHelper')

exports.NotifyDelayService = function NotifyDelayService(notifier, log = console.log, error = console.log) {

  this.sendAll = async (registrations) => {
    log('Delay Changed Events:', registrations)

    var singleRegistrations = flatObjectAttributeBy(registrations, 'peopleToNotify')

    await forEach(singleRegistrations, notify)
      .then(error)
      .catch(error)
  }

  function notify(registration) {
    return notifier.notify(registration.peopleToNotify, registration.trainNumber, registration.departureStation, registration.delay)
  }
}