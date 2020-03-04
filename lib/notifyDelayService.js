'use strict'

exports.NotifyDelayService = function NotifyDelayService(notifier, log = console.log) {

  this.sendAll = async (registrations) => {
    log('Delay Changed Events:', registrations)

    registrations.forEach((registration) => {
      registration.peopleToNotify.forEach((recipient) => {
        notifier.notify(recipient, registration.trainNumber, registration.departureStation, registration.delay)
      })
    })
  }
}