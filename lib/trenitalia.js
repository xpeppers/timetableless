'use strict'

exports.Trenitalia = function Trenitalia() {
  const axios = require("axios")
  const basePath = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno"

  this.trainDelays = async (train) => {
    let stops = await retrieveStops(train)

    return stops.map(toStations)
  }

  this.departureTime = async (train, station) => {
    let stops = await retrieveStops(train)

    let stop = stops.filter(is(station))[0]

    return new Date(stop.partenza_teorica)
  }

  async function retrieveStops(train) {
    let startingStation = await findStartingStation(train)
    let response = await axios.get(`${basePath}/andamentoTreno/${startingStation}/${train}`)
    return response.data.fermate
  }

  function toStations(stop) {
    return {
      station: stop.id,
      delay: stop.ritardoPartenza
    }
  }

  async function findStartingStation (train) {
    let response = await axios.get(`${basePath}/cercaNumeroTrenoTrenoAutocomplete/${train}`)

    return response.data.split('|')[1].split('-')[1].trim()
  }

  function is(stationId) {
    return (stop) => stop.id === stationId
  }
}