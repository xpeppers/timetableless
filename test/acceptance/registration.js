const { deepEqual: equal } = require('assert')
const { DynamoDbClientBuilder } = require("../../lib/dynamoDbClientBuilder")
const { RegistrationRepository } = require("../../lib/registrationRepository")
const axios = require('axios').default
const localClient = new DynamoDbClientBuilder(true).build()
const repository = new RegistrationRepository(localClient)

describe('Registration', () => {
  it('Registers a new user for a new station', async () => {
    let response = await axios.post("http://localhost:3000/registration", {email: 'pippo', trainNumber:'4640', station:'S00461'})

    equal(response.data, "'pippo' registered")
    let registrations = await repository.findAll(['06:24'])
    equal(registrations.length, 1)
    equal(registrations[0].peopleToNotify, ['pippo'])
  })
})
