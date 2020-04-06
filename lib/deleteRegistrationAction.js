'use strict'

exports.DeleteRegistrationAction = function DeleteRegistrationAction(repository, trenitalia, log = console.log, logError = console.log) {

  this.execute = async (train, timeSlot, recipient) => {
    try {
      let exists = await repository.exists(train, timeSlot)

      if(!exists) {
        return Promise.resolve(() => `Registration not present for TimeSlot: ${timeSlot} and Train: ${train}`)
      }

      let response = await repository.delete(train, timeSlot, recipient)

      return `'${recipient}' removes with response: (${response})`
    } catch(e) {
      logError(`DeleteRegistrationAction::execute(${train}, ${timeSlot}, ${recipient})`, e)
      throw new Error("Enter valid values")
    }
  }

  function formatTime(date) {
    return date.toISOString().split('T')[1].split('.')[0]
  }
}