'use strict'

const sinon = require('sinon')
const { UpdateDelayService } = require("../lib/updateDelayService")
const { RegistrationRepository } = require('../lib/registrations')
const { Trenitalia } = require('../lib/trenitalia')

const registrationRepository = new RegistrationRepository()
const trenitalia = new Trenitalia()
const stubLogger = () => {}

describe('UpdateDelayService', () => {
  it('update delay when delay is changed', async () => {
    const repository = sinon.mock(registrationRepository)
    const trenitaliaService = sinon.mock(trenitalia)
    const service = new UpdateDelayService(registrationRepository, trenitalia, stubLogger)
    const registr = registration('4640', 'S00458', 0)

    repository.expects('findAll').returns([registr]).once()
    trenitaliaService.expects('trainDelays').withArgs('4640').returns(Promise.resolve([{station: 'S00458', delay: 99}])).once()
    repository.expects('updateDelay').withArgs(registr, 99).returns(Promise.resolve(registr)).once()

    await service.update(new Date())

    trenitaliaService.verify()
    repository.verify()
  })

  it('do not update delay when delay is not changed', async () => {
    const repository = sinon.mock(registrationRepository)
    const trenitaliaService = sinon.mock(trenitalia)
    const service = new UpdateDelayService(registrationRepository, trenitalia, stubLogger)
    const registr = registration('4640', 'S00458', 0)

    repository.expects('findAll').returns([registr]).once()
    trenitaliaService.expects('trainDelays').withArgs('4640').returns(Promise.resolve([{station: 'S00458', delay: 0}])).once()
    repository.expects('updateDelay').withArgs(registr, 0).returns(Promise.resolve(registr)).never()

    await service.update(new Date())

    trenitaliaService.verify()
    repository.verify()
  })
})

function registration(trainNumber, departureStation, delay) {
  return {
    trainNumber: trainNumber,
    departureStation: departureStation,
    peopleToNotify: [ 'Antonio' ],
    timeSlot: '13:56',
    departureTime: '13:57:19',
    delay: delay
  }
}