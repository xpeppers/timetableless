const { deepEqual: equal } = require("assert")
const { DynamoDbClientBuilder } = require("../../lib/dynamoDbClientBuilder")
const { RegistrationRepository } = require("../../lib/registrationRepository")
const localClient = new DynamoDbClientBuilder(true).build()

describe('RegistrationRepository', () => {
  const repository = new RegistrationRepository(localClient)

  it('findAll', async () => {
    let registrations = await repository.findAll(['00:00'])

    equal(registrations.length, 1)
    equal(registrations[0].timeSlot, "00:00")
    equal(Object.keys(registrations[0]), ["departureTime", "trainNumber", "departureStation", "delay", "peopleToNotify", "timeSlot"])
  })

  it('create', async () => {
    let created = await repository.create({
      trainNumber: "235",
      departureStation: "S235",
      peopleToNotify: ["cre@te.d"],
      timeSlot: "23:58",
      departureTime: "23:59:00",
      delay: 235
    })

    let expectedRegistrations = await repository.findAll(['23:58'])

    equal(expectedRegistrations.length, 1)
    equal(created, expectedRegistrations[0])
  })

  it('updateDelay', async () => {
    let updatedRegistration = await repository.updateDelay({
      trainNumber: "002",
      departureStation: "S002",
      peopleToNotify: ["update@dela.y"],
      timeSlot: "00:02",
      departureTime: "00:02:22",
      delay: 2
    }, 99)

    let registrations = await repository.findAll(['00:02'])

    equal(registrations.length, 1)
    equal(registrations[0].delay, 99)
    equal(updatedRegistration, registrations[0])
  })

  it('exists', async () => {
    let exists = await repository.exists("000", "00:00")

    equal(exists, true)
  })

  it('not exists', async () => {
    let exists = await repository.exists("969", "19:59")

    equal(exists, false)
  })

  it('addPersonToNotify', async () => {
    let updatedRegistration = await repository.addPersonToNotify("000", "00:00", "person@add.ed")

    let expectedRegistrations = await repository.findAll(['00:00'])

    equal(expectedRegistrations.length, 1)
    equal(expectedRegistrations[0].peopleToNotify, ["fi@nd.all", "person@add.ed"])
    equal(updatedRegistration, expectedRegistrations[0])
  })
})