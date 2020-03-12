'use strict'

const { mock } = require('sinon')
const { RegistrationService } = require("../lib/registrationService")
const { RegistrationRepository } = require("../lib/registrationRepository")
const { Trenitalia } = require("../lib/trenitalia")
const stubLog = () => {}

describe('RegistrationService', () => {
  it('creates a new registration', async () => {
    const registrationRepository = new RegistrationRepository()
    const trenitalia = new Trenitalia()
    const repository = mock(registrationRepository)
    const trenitaliaService = mock(trenitalia)

    trenitaliaService.expects('departureTime').withArgs('4640', 'S00458').returns(Promise.resolve(new Date('2020-01-01T10:01:00Z')))
    repository.expects('exists').withArgs('4640', '10:00').returns(Promise.resolve(false)).once()
    repository.expects('create').withArgs(registration(['a@b.c'], '4640', 'S00458', '10:00', '10:01:00', 0)).once()

    await new RegistrationService(registrationRepository, trenitalia, stubLog).addRegistration('a@b.c', '4640', 'S00458')

    repository.verify()
  })

  it('update an already existing registration', async () => {
    const registrationRepository = new RegistrationRepository()
    const trenitalia = new Trenitalia()
    const repository = mock(registrationRepository)
    const trenitaliaService = mock(trenitalia)

    trenitaliaService.expects('departureTime').withArgs('4640', 'S00458').returns(Promise.resolve(new Date('2020-01-01T10:01:00Z')))
    repository.expects('exists').withArgs('4640', '10:00').returns(Promise.resolve(true)).once()
    repository.expects('addPersonToNotify').withArgs('4640', '10:00', 'a@b.c').once()

    await new RegistrationService(registrationRepository, trenitalia, stubLog).addRegistration('a@b.c', '4640', 'S00458')

    repository.verify()
  })

  it('respond with an error when train not found', async () => {
    const registrationRepository = new RegistrationRepository()
    const trenitalia = new Trenitalia()
    const repository = mock(registrationRepository)
    const trenitaliaService = mock(trenitalia)

    trenitaliaService.expects('departureTime').withArgs('not_found', 'not_found').throws(new Error("not found"))
    repository.expects('exists').never()
    repository.expects('addPersonToNotify').never()
    repository.expects('create').never()

    await new RegistrationService(registrationRepository, trenitalia, stubLog).addRegistration('a@b.c', '4640', 'S00458')

    repository.verify()
  })
})

function registration(recipients, trainNumber, departureStation, timeSlot, departureTime, delay) {
  return {
    trainNumber: trainNumber,
    departureStation: departureStation,
    peopleToNotify: recipients,
    timeSlot: timeSlot,
    departureTime: departureTime,
    delay: delay
  }
}