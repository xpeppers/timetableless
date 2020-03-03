'use strict'

exports.Trenitalia = function Trenitalia() {
  const axios = require("axios")
  const basePath = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno"

  this.trainDelays = async (trainNumber) => {
    var startingStation = await findStartingStation(trainNumber)
    var response = await axios.get(`${basePath}/andamentoTreno/${startingStation}/${trainNumber}`)
    var stops = response.data.fermate

    return stops.map(toStations)
  }

  function toStations(stop) {
    return {
      station: stop.id,
      delay: stop.ritardoPartenza
    }
  }

  async function findStartingStation (trainNumber) {
    var response = await axios.get(`${basePath}/cercaNumeroTrenoTrenoAutocomplete/${trainNumber}`)

    return response.data.split('|')[1].split('-')[1].trim()
  }
}