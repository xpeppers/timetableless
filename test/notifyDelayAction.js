'use strict'

const { mock, match } = require('sinon')
const { NotifyDelayAction } = require("../lib/notifyDelayAction")
const { EmailNotifier } = require("../lib/emailNotifier")
const { Token } = require("../lib/token")
const { Trenitalia } = require('../lib/trenitalia')
const stubLogger = () => {}

describe('NotifyDelayAction', () => {
  it('notify a registered user', async () => {
    const emailNotifier = new EmailNotifier()
    const trenitalia = new Trenitalia()
    const notifier = mock(emailNotifier)
    const trenitaliaService = mock(trenitalia)

    trenitaliaService.expects('trainStationInfo').returns(Promise.resolve({trainName: 'Tname', stationName: 'Sname'}))
    notifier.expects('notify').withArgs('a@b.c', 'Tname', 'Sname', 1, match.any).once()

    await new NotifyDelayAction(emailNotifier, trenitalia, stubLogger).execute([registration(['a@b.c'], 'S001', 'departureStation', 1)])

    notifier.verify()
  })

  it('notify multiple registered users', async () => {
    const emailNotifier = new EmailNotifier()
    const trenitalia = new Trenitalia()
    const notifier = mock(emailNotifier)
    const trenitaliaService = mock(trenitalia)

    trenitaliaService.expects('trainStationInfo').twice().returns(Promise.resolve({trainName: 'Tname', stationName: 'Sname'}))
    notifier.expects('notify').withArgs('a@b.c', 'Tname', 'Sname', 1, match.any).once()
    notifier.expects('notify').withArgs('d@e.f', 'Tname', 'Sname', 1, match.any).once()

    await new NotifyDelayAction(emailNotifier, trenitalia, stubLogger).execute([registration(['a@b.c','d@e.f'], 'S001', 'departureStation', 1)])

    notifier.verify()
  })

  it('notify a registered user', async () => {
    const emailNotifier = new EmailNotifier()
    const trenitalia = new Trenitalia()
    const notifier = mock(emailNotifier)
    const first = registration(['a@b.c'], 'first', 'Trento', 1)
    const last = registration(['d@e.f'], 'last', 'Rovereto', 2)
    const trenitaliaService = mock(trenitalia)

    trenitaliaService.expects('trainStationInfo').withArgs('first', 'Trento').returns(Promise.resolve({trainName: 'FIRST', stationName: 'TRENTO'}))
    notifier.expects('notify').withArgs('a@b.c', 'FIRST', 'TRENTO', 1, match.any).once()
    trenitaliaService.expects('trainStationInfo').withArgs('last', 'Rovereto').returns(Promise.resolve({trainName: 'LAST', stationName: 'ROVERETO'}))
    notifier.expects('notify').withArgs('d@e.f', 'LAST', 'ROVERETO', 2, match.any).once()

    await new NotifyDelayAction(emailNotifier, trenitalia, stubLogger).execute([first, last])

    notifier.verify()
  })

  it('sends token to allow deleting a registration', async () => {
    const emailNotifier = new EmailNotifier()
    const trenitalia = new Trenitalia()
    const notifier = mock(emailNotifier)
    const trenitaliaService = mock(trenitalia)

    trenitaliaService.expects('trainStationInfo').returns(Promise.resolve({trainName: 'Tname', stationName: 'Sname'}))
    notifier.expects('notify').withArgs('a@b.c', 'Tname', 'Sname', 1, Token.encode('13:56', 'S001', 'a@b.c')).once()
    await new NotifyDelayAction(emailNotifier, trenitalia, stubLogger).execute([registration(['a@b.c'], 'S001', 'departureStation', 1, '13:56')])

    notifier.verify()
  })
})

function registration(recipients, trainNumber, departureStation, delay, timeSlot='13:56') {
  return {
    trainNumber: trainNumber,
    departureStation: departureStation,
    peopleToNotify: recipients,
    timeSlot: timeSlot,
    departureTime: '13:57:19',
    delay: delay
  }
}
