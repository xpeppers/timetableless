
exports.forEach = (list, fn) => {
  return Promise.all(list.map(fn)).catch(console.error)
}

exports.flatArray = (values) => {
  return [].concat(...values)
}

exports.flatObjectByAttribute = (list, attribute) => {
  var arr = list.map(element => {
    return element[attribute].map(value => mapObjectWith(element, attribute, value))
  })

  return this.flatArray(arr)
}


function mapObjectWith(element, attribute, value) {
  var newAttribute = {}
  newAttribute[attribute] = value
  return Object.assign({}, element, newAttribute)
}