const { deepEqual: equal } = require("assert")
const { DynamoDbClientBuilder } = require("../../lib/dynamoDbClientBuilder")
const { RegistrationRepository } = require("../../lib/registrationRepository")
const { TestingDB } = require("../utils/testingDB")
const localClient = new DynamoDbClientBuilder(true).build()
const wrongClient = new DynamoDbClientBuilder(false).build()
const DB = new TestingDB(localClient)
const stubLog = () => {}

describe('RegistrationRepository', () => {
  const repository = new RegistrationRepository(stubLog, localClient)
  const wrongRepo = new RegistrationRepository(stubLog, wrongClient)

  beforeEach(async () => {
    await DB.cleanUp()
  })

  it('create', async () => {
    let created = await repository.create({ timeSlot: "00:02", trainNumber: "002", departureStation: "S002", delay: 2, peopleToNotify: ["pe@op.le"], departureTime: "00:02:22" })

    let expectedRegistrations = await DB.scanRecords()

    equal(expectedRegistrations.length, 1)
    equal(created, expectedRegistrations[0])
  })

  it('cannot create, client not configured', (done) => {
    wrongRepo.create({ timeSlot: "00:02", trainNumber: "002", departureStation: "S002", delay: 2, peopleToNotify: ["pe@op.lee"], departureTime: "00:02:22" })
      .then(() => "Should throws an error, but was not thrown")
      .catch(e => {
        equal(e.message, "Missing region in config")
      })
      .then(done)
      .catch(done)
  })

  it('findAll', async () => {
    await repository.create({ timeSlot: "00:02", trainNumber: "002", departureStation: "S002", delay: 2, peopleToNotify: ["pe@op.le"], departureTime: "00:02:22" })
    await repository.create({ timeSlot: "11:55", trainNumber: "115", departureStation: "S115", delay: 5, peopleToNotify: ["not@pres.ent"], departureTime: "11:55:33" })

    let registrations = await repository.findAll(['00:02'])

    equal(registrations.length, 1)
    equal(registrations[0].timeSlot, "00:02")
    equal(Object.keys(registrations[0]), ["departureTime", "trainNumber", "departureStation", "delay", "timeSlot", "peopleToNotify"])
  })

  it('updateDelay', async () => {
    await repository.create({ timeSlot: "00:02", trainNumber: "002", departureStation: "S002", delay: 2, peopleToNotify: ["pe@op.le"], departureTime: "00:02:22" })

    let updatedRegistration = await repository.updateDelay({ trainNumber: "002", departureStation: "S002", peopleToNotify: ["pe@op.le"], timeSlot: "00:02", departureTime: "00:02:22", delay: 2 }, 99)

    let registrations = await DB.scanRecords()

    equal(registrations.length, 1)
    equal(registrations[0].delay, 99)
    equal(updatedRegistration, registrations[0])
  })

  it('cannot updateDelay, client not configured', (done) => {
    wrongRepo.updateDelay({ trainNumber: "002", departureStation: "S002", peopleToNotify: ["pe@op.le"], timeSlot: "00:02", departureTime: "00:02:22", delay: 2 }, 99)
      .then(() => "Should throws an error, but was not thrown")
      .catch(e => {
        equal(e.message, "Missing region in config")
      })
      .then(done)
      .catch(done)
  })

  it('exists', async () => {
    await repository.create({ timeSlot: "00:02", trainNumber: "002", departureStation: "S002", delay: 0, peopleToNotify: ["pe@op.le"], departureTime: "00:02:22" })

    let exists = await repository.exists("002", "00:02")

    equal(exists, true)
  })

  it('not exists', async () => {
    let exists = await repository.exists("002", "00:02")

    equal(exists, false)
  })

  it('cannot check if exists, client not configured', (done) => {
    wrongRepo.exists("002", "00:02")
      .then(() => "Should throws an error, but was not thrown")
      .catch(e => {
        equal(e.message, "Missing region in config")
      })
      .then(done)
      .catch(done)
  })

  it('addPersonToNotify', async () => {
    await repository.create({ timeSlot: "00:02", trainNumber: "002", departureStation: "S002", delay: 0, peopleToNotify: ["pe@op.le"], departureTime: "00:02:22" })

    await repository.addPersonToNotify("002", "00:02", "person@add.ed")

    let expectedRegistrations = await DB.scanRecords()

    equal(expectedRegistrations.length, 1)
    equal(expectedRegistrations[0].peopleToNotify, ["pe@op.le", "person@add.ed"])
  })

  it('cannot addPersonToNotify', (done) => {
    wrongRepo.addPersonToNotify("002", "00:02", "person@add.ed")
      .then(() => "Should throws an error, but was not thrown")
      .catch(e => {
        equal(e.message, "Missing region in config")
      })
      .then(done)
      .catch(done)
  })

  it('delete registration with single user', async () => {
    await repository.create({ timeSlot: "00:02", trainNumber: "002", departureStation: "S002", delay: 0, peopleToNotify: ["pe@op.le"], departureTime: "00:02:22" })

    await repository.delete("002", "00:02", "pe@op.le")

    let afterDelete = await DB.scanRecords()
    equal(afterDelete.length, 0)
  })

  it('delete registration with multiple users', async () => {
    await repository.create({ timeSlot: "00:02", trainNumber: "002", departureStation: "S002", delay: 0, peopleToNotify: ["pe@op.le", "another@user.com"], departureTime: "00:02:22" })

    await repository.delete("002", "00:02", "pe@op.le")

    let afterDelete = await DB.scanRecords()
    equal(afterDelete.length, 1)
    equal(afterDelete[0].peopleToNotify, ['another@user.com'])
  })

  it('cannot delete', (done) => {
    wrongRepo.delete("002", "00:02", "pe@op.le")
      .then(() => "Should throws an error, but was not thrown")
      .catch(e => {
        equal(e.message, "Missing region in config")
      })
      .then(done)
      .catch(done)
  })
})