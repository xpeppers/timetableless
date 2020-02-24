'use strict'

const axios = require("axios")

function toStations(stop) {
  return {
    station: stop.id,
    delay: stop.ritardoPartenza
  }
}

async function findStartingStation (trainNumber) {
  var response = await axios.get(`http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/${trainNumber}`)

  return response.data.split('|')[1].split('-')[1].trim()
}

exports.trainDelays = async function trainDelays (trainNumber) {
  var startingStation = await findStartingStation(trainNumber)

  var response = await axios.get(`http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/${startingStation}/${trainNumber}`)
  var stops = response.data.fermate

  return stops.map(toStations)
}