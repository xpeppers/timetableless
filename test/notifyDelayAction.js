'use strict'

const { mock, match } = require('sinon')
const { NotifyDelayAction } = require("../lib/notifyDelayAction")
const { EmailNotifier } = require("../lib/emailNotifier")
const { Token } = require("../lib/token")
const stubLogger = () => {}

describe('NotifyDelayAction', () => {
  it('notify a registered user', async () => {
    const emailNotifier = new EmailNotifier()
    const notifier = mock(emailNotifier)

    notifier.expects('notify').withArgs('a@b.c', 'S001', 'departureStation', 1, match.any).once()

    await new NotifyDelayAction(emailNotifier, stubLogger).execute([registration(['a@b.c'], 'S001', 'departureStation', 1)])

    notifier.verify()
  })

  it('notify multiple registered users', async () => {
    const emailNotifier = new EmailNotifier()
    const notifier = mock(emailNotifier)

    notifier.expects('notify').withArgs('a@b.c', 'S001', 'departureStation', 1, match.any).once()
    notifier.expects('notify').withArgs('d@e.f', 'S001', 'departureStation', 1, match.any).once()

    await new NotifyDelayAction(emailNotifier, stubLogger).execute([registration(['a@b.c','d@e.f'], 'S001', 'departureStation', 1)])

    notifier.verify()
  })

  it('notify a registered user', async () => {
    const emailNotifier = new EmailNotifier()
    const notifier = mock(emailNotifier)
    const first = registration(['a@b.c'], 'first', 'Trento', 1)
    const last = registration(['d@e.f'], 'last', 'Rovereto', 2)

    notifier.expects('notify').withArgs('a@b.c', 'first', 'Trento', 1, match.any).once()
    notifier.expects('notify').withArgs('d@e.f', 'last', 'Rovereto', 2, match.any).once()

    await new NotifyDelayAction(emailNotifier, stubLogger).execute([first, last])

    notifier.verify()
  })

  it('sends token to allow deleting a registration', async () => {
    const emailNotifier = new EmailNotifier()
    const notifier = mock(emailNotifier)

    notifier.expects('notify').withArgs('a@b.c', 'S001', 'departureStation', 1, Token.encode('13:56', 'S001', 'a@b.c')).once()
    await new NotifyDelayAction(emailNotifier, stubLogger).execute([registration(['a@b.c'], 'S001', 'departureStation', 1, '13:56')])

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
