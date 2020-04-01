'use strict'

const { RegistrationRepository } = require('../lib/registrationRepository')
const { Trenitalia } = require('../lib/trenitalia')
const { UpdateDelayAction } = require("../lib/updateDelayAction")

module.exports.handler = async () => {
  const service = new UpdateDelayAction(new RegistrationRepository(), new Trenitalia())

  let response = await service.execute(new Date(), 60)
  console.log("update delays handler response: ", response)
}