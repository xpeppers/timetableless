'use strict'

function format(date) {
  var hours = date.getHours()
  var minutes = '' + date.getMinutes()

  if (minutes.length == 1) {
    minutes = '0' + minutes
  }

  return `${hours}:${minutes}`
}

exports.from = function from(date, range) {
  var slotSize = 2 // minutes
  var slotNumber = (range / 2) + 1

  return Array.from(Array(slotNumber).keys())
  .map( (index) => {
    var currentDate = new Date(date)
    currentDate.setMinutes( currentDate.getMinutes() + (index * slotSize) )
    return format(currentDate)
  })
}