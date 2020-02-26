
module.exports.forEach = function forEach(list, fn) {
  return Promise.all(list.map(fn)).catch(console.error)
}
