'use strict'

const registrationRepository = require('./lib/registrations')
const timeSlots = require('./lib/timeSlots')
const trenitalia = require('./lib/trenitalia')

const ONE_HOUR = 60

module.exports.hello = async event => {
  var slots = timeSlots.from(new Date(), ONE_HOUR)
  var registrations = await registrationRepository.forAll(slots)
  // group by train number in order to make one request foreach station

  // registrations.forEach( (registration) => {
  //   var trainInfo = trenitalia.trainInfo(registration.trainNumber)
  // })

  // per ogni treno
  // recuperiamo stazione di partenza: http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/4620
  // chiediamo info treno: http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/<id-stazione-partenza>/<numero-treno>
  // per ogni stazione registrata aggiornare il ritardo

  return {
    statusCode: 200,
    body: JSON.stringify({ registrations, event }, null, 2)
  }
}
