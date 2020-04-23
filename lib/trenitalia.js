'use strict'

exports.Trenitalia = function Trenitalia() {
  const axios = require("axios")
  const basePath = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno"

  this.autocompleteStation = async (term) => {
    let response = await axios.get(`${basePath}/autocompletaStazione/${term}`)
    return response.data
  }

  this.trainDelays = async (train) => {
    let stops = await retrieveStops(train)

    return stops.map(toStations)
  }

  this.trainStationInfo = async (train, station) => {
    let info = await trainInfo(train)
    let stops = await retrieveStopsFromStartingStation(train, info.startingStation)
    let stationName = stops.filter(is(station))[0].stazione

    return {
      trainName: info.name,
      stationName: stationName
    }
  }

  this.departureTime = async (train, station) => {
    let stops = await retrieveStops(train)
    let stop = stops.filter(is(station))[0]

    return new Date(stop.partenza_teorica)
  }

  async function retrieveStops(train) {
    let startingStation = await findStartingStation(train)
    return await retrieveStopsFromStartingStation(train, startingStation)
  }

  async function retrieveStopsFromStartingStation(train, startingStation) {
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
    let response = await trainInfo(train)
    return response.startingStation
  }

  async function trainInfo (train) {
    let response = await axios.get(`${basePath}/cercaNumeroTrenoTrenoAutocomplete/${train}`)
    let [trainName, stationInfo] = response.data.split('|')
    return {
      name: trainName,
      startingStation: stationInfo.split('-')[1].trim()
    }
  }

  function is(stationId) {
    return (stop) => stop.id === stationId
  }
}
