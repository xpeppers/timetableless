'use strict'

const { RegistrationRepository } = require('../lib/registrationRepository')
const { Trenitalia } = require('../lib/trenitalia')
const { UpdateDelayService } = require("../lib/updateDelayService")

module.exports.handler = async () => {
  const service = new UpdateDelayService(new RegistrationRepository(), new Trenitalia())

  let response = await service.update(new Date(), 60)
  console.log("update delays handler response: ", response)
}