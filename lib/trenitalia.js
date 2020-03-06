'use strict'

exports.Trenitalia = function Trenitalia() {
  const axios = require("axios")
  const basePath = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno"

  this.trainDelays = async (train) => {
    var stops = await retrieveStops(train)

    return stops.map(toStations)
  }

  this.departureTime = async (train, station) => {
    var stops = await retrieveStops(train)

    var stop = stops.filter(is(station))[0]

    return new Date(stop.partenza_teorica)
  }

  async function retrieveStops(train) {
    var startingStation = await findStartingStation(train)
    var response = await axios.get(`${basePath}/andamentoTreno/${startingStation}/${train}`)
    return response.data.fermate
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

  function is(stationId) {
    return (stop) => stop.id === stationId
  }
}