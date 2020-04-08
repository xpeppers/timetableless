'use strict'

const { equal } = require("assert")
const { Token } = require("../lib/token")

describe('Token', () => {
  it('decodes token', () => {
    let { timeSlot, trainNumber, email } = Token.decode('MTI6MDB8NDU0MHxhQGIuY3wK')

    equal(timeSlot, "12:00")
    equal(trainNumber, "4540")
    equal(email, "a@b.c")
  })
})
