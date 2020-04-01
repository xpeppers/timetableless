'use strict'

const { mock } = require('sinon')
const { UpdateDelayAction } = require("../lib/updateDelayAction")
const { RegistrationRepository } = require('../lib/registrationRepository')
const { Trenitalia } = require('../lib/trenitalia')

const registrationRepository = new RegistrationRepository()
const trenitalia = new Trenitalia()
const stubLogger = () => {}

describe('UpdateDelayAction', () => {
  it('update delay when delay is changed', async () => {
    const repository = mock(registrationRepository)
    const trenitaliaService = mock(trenitalia)
    const service = new UpdateDelayAction(registrationRepository, trenitalia, stubLogger)
    const registr = registration('4640', 'S00458', 0)

    repository.expects('findAll').returns([registr]).once()
    trenitaliaService.expects('trainDelays').withArgs('4640').returns(Promise.resolve([{station: 'S00458', delay: 99}])).once()
    repository.expects('updateDelay').withArgs(registr, 99).returns(Promise.resolve(registr)).once()

    await service.execute(new Date())

    trenitaliaService.verify()
    repository.verify()
  })

  it('do not update delay when delay is not changed', async () => {
    const repository = mock(registrationRepository)
    const trenitaliaService = mock(trenitalia)
    const service = new UpdateDelayAction(registrationRepository, trenitalia, stubLogger)
    const registr = registration('4640', 'S00458', 0)

    repository.expects('findAll').returns([registr]).once()
    trenitaliaService.expects('trainDelays').withArgs('4640').returns(Promise.resolve([{station: 'S00458', delay: 0}])).once()
    repository.expects('updateDelay').withArgs(registr, 0).returns(Promise.resolve(registr)).never()

    await service.execute(new Date())

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