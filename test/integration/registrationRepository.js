const { deepEqual: equal } = require("assert")
const { DynamoDbClientBuilder } = require("../../lib/dynamoDbClientBuilder")
const { RegistrationRepository } = require("../../lib/registrationRepository")
const localClient = new DynamoDbClientBuilder(true).build()

const { forEach } = require('../../lib/asyncHelper')

const DB = new TestingDB()

describe('RegistrationRepository', () => {
  const repository = new RegistrationRepository(localClient)

  beforeEach(async () => {
    await DB.cleanUp()
  })

  it('create', async () => {
    let created = await repository.create({ timeSlot: "00:02", trainNumber: "002", departureStation: "S002", delay: 2, peopleToNotify: ["pe@op.le"], departureTime: "00:02:22" })

    let expectedRegistrations = await DB.scanRecords()

    equal(expectedRegistrations.length, 1)
    equal(created, expectedRegistrations[0])
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

    let updatedRegistration = await repository.updateDelay({
      trainNumber: "002",
      departureStation: "S002",
      peopleToNotify: ["pe@op.le"],
      timeSlot: "00:02",
      departureTime: "00:02:22",
      delay: 2
    }, 99)

    let registrations = await DB.scanRecords()

    equal(registrations.length, 1)
    equal(registrations[0].delay, 99)
    equal(updatedRegistration, registrations[0])
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

  it('addPersonToNotify', async () => {
    await repository.create({ timeSlot: "00:02", trainNumber: "002", departureStation: "S002", delay: 0, peopleToNotify: ["pe@op.le"], departureTime: "00:02:22" })

    await repository.addPersonToNotify("002", "00:02", "person@add.ed")

    let expectedRegistrations = await DB.scanRecords()

    equal(expectedRegistrations.length, 1)
    equal(expectedRegistrations[0].peopleToNotify, ["pe@op.le", "person@add.ed"])
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
})

function TestingDB(dynamoDb = new DynamoDbClientBuilder(true).build()) {
  function parseItem (item) {
    item.peopleToNotify = (item.peopleToNotify) ? item.peopleToNotify.values : []
    return item
  }

  this.cleanUp = () => {
    return this.scanRecords().then(records => forEach(records, this.remove))
  }

  this.scanRecords = () => {
    return new Promise((resolve, reject) => {
      let tableName = `registrations-${process.env.stage}`
      let params = {TableName: tableName}
      dynamoDb.scan(params, function (err, data) {
        if (err) {
          reject(err)
          return
        }

        if (!data || !data.Items) {
          reject(new Error("Data has no Items field"))
          return
        }

        resolve(data.Items.map(parseItem))
      })
    })
  }

  this.remove = (record) => {
    return new Promise((resolve, reject) => {
      let tableName = `registrations-${process.env.stage}`
      var params = {
        TableName: tableName,
        Key: { 'timeSlot': record.timeSlot, 'trainNumber': record.trainNumber }
      }

      dynamoDb.delete(params, function(err) {
        if (err) {
          reject(err)
        } else {
          resolve('')
        }
      })
    }).catch(console.log)
  }
}