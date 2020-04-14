'use strict'

const { Trenitalia } = require("../lib/trenitalia")

function headers () {
  return {'Access-Control-Allow-Origin': '*'}
}

function respond(body) {
  console.log("RESPONDED WITH:" + body)
  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: headers()
  }
}

function error(err) {
  console.log("ERROR: ", err)
  return {
    statusCode: 400,
    body: JSON.stringify({ message: err.message }),
    headers: headers()
  }
}

module.exports.handler = async (event) => {
  try {
    return respond(await new Trenitalia().autocompleteStation(event.pathParameters.term))
  } catch(err) {
    return error(err)
  }
}
