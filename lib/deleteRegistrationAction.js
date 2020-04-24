'use strict'

exports.DeleteRegistrationAction = function DeleteRegistrationAction(repository, log, logError) {

  this.execute = async (train, timeSlot, recipient) => {
    let exists = await repository.exists(train, timeSlot)

    if(!exists) {
      logError(`Registration not present for TimeSlot: ${timeSlot} and Train: ${train}`)
      return
    }

    await repository.delete(train, timeSlot, recipient)

    log(`'${recipient}' removed`)
  }
}