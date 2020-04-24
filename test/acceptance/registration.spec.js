'use strict'

const { ok, deepEqual: equal } = require('assert')
const axios = require('axios').default
const { TestingDB } = require("../utils/testingDB")
const { Token } = require("../../lib/token")
const DB = new TestingDB()

describe('Registration', () => {

  beforeEach(async () => {
    await DB.cleanUp()
  })

  it('Registers a new user for a new station', async () => {
    let response = await axios.post("http://localhost:3000/registration", {email: 'pippo', trainNumber:'4640', station:'S00461'})

    equal(response.data, { message: "registered" })

    let registrations = await DB.scanRecords()
    equal(registrations.length, 1)
    equal(registrations[0].peopleToNotify, ['pippo'])
  })

  it('Registers same user for a new station twice', async () => {
    await axios.post("http://localhost:3000/registration", {email: 'pippo', trainNumber:'4640', station:'S00461'})
    let response = await axios.post("http://localhost:3000/registration", {email: 'pippo', trainNumber:'4640', station:'S00461'})

    let registrations = await DB.scanRecords()
    equal(registrations.length, 1)
    equal(registrations[0].peopleToNotify, ['pippo'])

    equal(response.data, { message: "registered" })
  })

  it('Fails to register a new user for a new station', async () => {
    try {
      await axios.post("http://localhost:3000/registration", {email: 'pippo', trainNumber:'not_found', station:'not_found'})
      throw new Error("should throw an error, but it doesn't")
    } catch(error) {
      equal(error.response.status, 400)
      equal(error.response.data, { message: "Enter valid values" })
    }
  })

  it('Deletes a registration', async () => {
      await axios.post("http://localhost:3000/registration", {email: 'pippo', trainNumber:'4640', station:'S00461'})
      let registrations = await DB.scanRecords()

      let token = Token.encode(registrations[0].timeSlot, registrations[0].trainNumber, registrations[0].peopleToNotify[0])

      let response = await axios.get(`http://localhost:3000/registration/delete/${token}`, {maxRedirects:0}).catch((error) => Promise.resolve(error.response))

      equal(response.status, 302)
      ok(response.headers.location.endsWith("/delete-successful.html"))
      let remainingRegistrations = await DB.scanRecords()
      equal(remainingRegistrations, [])
  })

  it('Fails to delete a registration', async () => {
      await axios.post("http://localhost:3000/registration", {email: 'pippo', trainNumber:'4640', station:'S00461'})

      let response = await axios.get(`http://localhost:3000/registration/delete/invalidtoken`, {maxRedirects:0}).catch((error) => Promise.resolve(error.response))

      equal(response.status, 302)
      ok(response.headers.location.endsWith("/delete-failed.html"))
      let remainingRegistrations = await DB.scanRecords()
      equal(remainingRegistrations.length, 1)
  })
})
