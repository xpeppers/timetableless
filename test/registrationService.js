'use strict'

const { mock } = require('sinon')
const { RegistrationService } = require("../lib/registrationService")
const { RegistrationRepository } = require("../lib/registrationRepository")
const { Trenitalia } = require("../lib/trenitalia")
const stubLog = () => {}

const registrationRepository = new RegistrationRepository()
const trenitalia = new Trenitalia()

describe('RegistrationService', () => {
  it('creates a new registration', async () => {
    const repository = mock(registrationRepository)
    const trenitaliaService = mock(trenitalia)

    trenitaliaService.expects('departureTime').withArgs('4640', 'S00458').returns(Promise.resolve(new Date('2020-01-01T10:01:00Z')))
    repository.expects('create').withArgs(registration(['a@b.c'], '4640', 'S00458', '10:00', '10:01:00', 0)).once()

    await new RegistrationService(registrationRepository, trenitalia, stubLog, stubLog).addRegistration('a@b.c', '4640', 'S00458')

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