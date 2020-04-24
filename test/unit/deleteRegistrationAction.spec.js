'use strict'

const { equal } = require('assert')
const { mock } = require('sinon')
const { DeleteRegistrationAction } = require("../../lib/deleteRegistrationAction")
const { RegistrationRepository } = require("../../lib/registrationRepository")
const stubLog = () => {}

describe('DeleteRegistrationAction', () => {
  it('registration not present', async () => {
    const registrationRepository = new RegistrationRepository()
    const repository = mock(registrationRepository)

    repository.expects('exists').withArgs('4640', '10:00').returns(Promise.resolve(false)).once()
    repository.expects('delete').never()

    await new DeleteRegistrationAction(registrationRepository, stubLog, stubLog).execute('4640', '10:00', 'a@b.c')

    repository.verify()
  })

  it('deletes a registration', async () => {
    const registrationRepository = new RegistrationRepository()
    const repository = mock(registrationRepository)

    repository.expects('exists').withArgs('4640', '10:00').returns(Promise.resolve(true)).once()
    repository.expects('delete').withArgs('4640', '10:00', 'a@b.c').once()

    await new DeleteRegistrationAction(registrationRepository, stubLog, stubLog).execute('4640', '10:00', 'a@b.c')

    repository.verify()
  })
})
