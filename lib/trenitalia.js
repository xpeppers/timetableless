'use strict'

exports.Trenitalia = function Trenitalia() {
  const axios = require("axios")
  const basePath = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno"

  this.trainDelays = async (train) => {
    var startingStation = await findStartingStation(train)
    var response = await axios.get(`${basePath}/andamentoTreno/${startingStation}/${train}`)
    var stops = response.data.fermate

    return stops.map(toStations)
  }

  this.departureTime = async (train, station) => {
    return
  }

  function toStations(stop) {
    return {
      station: stop.id,
      delay: stop.ritardoPartenza
    }
  }

  async function findStartingStation (train) {
    var response = await axios.get(`${basePath}/cercaNumeroTrenoTrenoAutocomplete/${train}`)

    return response.data.split('|')[1].split('-')[1].trim()
  }
}