'use strict'

const { forEach, flatObjectByAttribute } = require('./asyncHelper')
const { Token } = require("./token")

exports.NotifyDelayAction = function NotifyDelayAction(notifier, trenitalia, log = console.log, error = console.log) {

  this.execute = async (registrations) => {
    log('Delay Changed Events:', registrations)

    let singleRegistrations = flatObjectByAttribute(registrations, 'peopleToNotify')

    return forEach(singleRegistrations, notify, error)
  }

  async function notify(registration) {
    let token = Token.encode(registration.timeSlot, registration.trainNumber, registration.peopleToNotify)
    let info = await trenitalia.trainStationInfo(registration.trainNumber, registration.departureStation)

    return await notifier.notify(registration.peopleToNotify, info.trainName, info.stationName, registration.delay, token)
  }
}
