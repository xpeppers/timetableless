'use strict'

let Token = {
  decode(token) {
    let [ timeSlot, trainNumber, email ] = Buffer.from(token, 'base64').toString('utf-8').split('|')
    return { timeSlot, trainNumber, email }
  },

  encode(timeSlot, trainNumber, email) {
    let stringToEncode = `${timeSlot}|${trainNumber}|${email}`
    return Buffer.from(stringToEncode).toString('base64')
  }
}

exports.Token = Token

