'use strict'

const { mock } = require('sinon')
const { NotifyDelayService } = require("../lib/notifyDelayService")
const { EmailNotifier } = require("../lib/emailNotifier")
const stubLogger = () => {}

describe('NotifyDelayService', () => {
  it('notify a registered user', async () => {
    const emailNotifier = new EmailNotifier()
    const notifier = mock(emailNotifier)

    notifier.expects('notify').withArgs('a@b.c', 'S001', 'departureStation', 1).once()

    await new NotifyDelayService(emailNotifier, stubLogger).sendAll([registration(['a@b.c'], 'S001', 'departureStation', 1)])

    notifier.verify()
  })

  it('notify multiple registered users', async () => {
    const emailNotifier = new EmailNotifier()
    const notifier = mock(emailNotifier)

    notifier.expects('notify').withArgs('a@b.c', 'S001', 'departureStation', 1).once()
    notifier.expects('notify').withArgs('d@e.f', 'S001', 'departureStation', 1).once()

    await new NotifyDelayService(emailNotifier, stubLogger).sendAll([registration(['a@b.c','d@e.f'], 'S001', 'departureStation', 1)])

    notifier.verify()
  })

  it('notify a registered user', async () => {
    const emailNotifier = new EmailNotifier()
    const notifier = mock(emailNotifier)
    const first = registration(['a@b.c'], 'first', 'Trento', 1)
    const last = registration(['d@e.f'], 'last', 'Rovereto', 2)

    notifier.expects('notify').withArgs('a@b.c', 'first', 'Trento', 1).once()
    notifier.expects('notify').withArgs('d@e.f', 'last', 'Rovereto', 2).once()

    await new NotifyDelayService(emailNotifier, stubLogger).sendAll([first, last])

    notifier.verify()
  })
})

function registration(recipients, trainNumber, departureStation, delay) {
  return {
    trainNumber: trainNumber,
    departureStation: departureStation,
    peopleToNotify: recipients,
    timeSlot: '13:56',
    departureTime: '13:57:19',
    delay: delay
  }
}