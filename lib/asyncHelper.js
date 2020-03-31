
exports.forEach = (list, fn, onError = console.error) => {
  let callback = (value) => Promise.resolve(fn(value)).catch((e) => onError("forEach error:", e))

  return Promise.all(list.map(callback)).then((values) => values.filter(value => value !== undefined))
}

exports.flatArray = (values) => {
  return [].concat(...values)
}

exports.flatObjectByAttribute = (list, attribute) => {
  let arr = list.map(element => {
    return element[attribute].map(value => mapObjectWith(element, attribute, value))
  })

  return this.flatArray(arr)
}


function mapObjectWith(element, attribute, value) {
  let newAttribute = {}
  newAttribute[attribute] = value
  return Object.assign({}, element, newAttribute)
}