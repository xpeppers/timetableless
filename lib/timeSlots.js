'use strict'

const SLOT_SIZE = 2

function format(dateTime) {
  let hours = '' + dateTime.getHours()
  let minutes = '' + dateTime.getMinutes()

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

function slotOf(dateTime) {
  let date = new Date(dateTime)
  date.setMinutes( dateTime.getMinutes() - (dateTime.getMinutes() % SLOT_SIZE) )
  return date
}

function addMinutes(dateTime, minutes) {
  let newDateTime = new Date(dateTime)
  newDateTime.setMinutes(newDateTime.getMinutes() + minutes)
  return newDateTime
}

function toSlotFrom(startingTime) {
  return (index) => {
    let slotTime = addMinutes(startingTime, index * SLOT_SIZE)
    return format(slotTime)
  }
}

exports.from = function from(dateTime, range) {
  let slotsNumber = (range / SLOT_SIZE) + 1
  let startingTime = slotOf(dateTime)

  return zeroTo(slotsNumber).map(toSlotFrom(startingTime))
}

exports.slotOf = slotOf
