'use strict'

exports.NotifyDelayService = function NotifyDelayService(log = console.log) {

  this.sendAll = async (registrations) => {
    log('Delay Changed Events:', registrations)
  }
}