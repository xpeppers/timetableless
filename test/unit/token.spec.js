'use strict'

const { equal } = require('assert')
const { Token } = require('../../lib/token')

describe('Token', () => {
  it('decodes token', () => {
    let { timeSlot, trainNumber, email } = Token.decode('MTI6MDB8NDU0MHxhQGIuYw==')

    equal(timeSlot, '12:00')
    equal(trainNumber, '4540')
    equal(email, 'a@b.c')
  })

  it('encodes token', () => {
    let token = Token.encode('12:00', '4540', 'a@b.c')

    equal(token, 'MTI6MDB8NDU0MHxhQGIuYw==')
  })
})
