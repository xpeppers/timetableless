'use strict'

const SLOT_SIZE = 2

function format(dateTime) {
  var hours = '' + dateTime.getHours()
  var minutes = '' + dateTime.getMinutes()

  if (hours.length == 1) {
    hours = '0' + hours
  }

  if (minutes.length == 1) {
    minutes = '0' + minutes
  }

  return `${hours}:${minutes}`
}

function zeroTo(number) {
  return Array.from(Array(number).keys())
}

function startOfCurrentSlot(dateTime) {
  return new Date(dateTime).setMinutes( dateTime.getMinutes() - (dateTime.getMinutes() % SLOT_SIZE) )
}

function addMinutes(dateTime, minutes) {
  var newDateTime = new Date(dateTime)
  newDateTime.setMinutes(newDateTime.getMinutes() + minutes)
  return newDateTime
}

function toSlotFrom(startingTime) {
  return (index) => {
    var slotTime = addMinutes(startingTime, index * SLOT_SIZE)
    return format(slotTime)
  }
}

exports.from = function from(dateTime, range) {
  var slotsNumber = (range / SLOT_SIZE) + 1
  var startingTime = startOfCurrentSlot(dateTime)

  return zeroTo(slotsNumber).map(toSlotFrom(startingTime))
}