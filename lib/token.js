'use strict'

let Token = {
  decode(token) {
    let [ timeSlot, trainNumber, email ] = Buffer.from(token, 'base64').toString('utf-8').split('|')
    return { timeSlot, trainNumber, email }
  }
}

exports.Token = Token

