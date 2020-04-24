'use strict'

const { RegistrationRepository } = require('../lib/registrationRepository')
const { Trenitalia } = require('../lib/trenitalia')
const { UpdateDelayAction } = require("../lib/updateDelayAction")

module.exports.handler = async () => {
  const action = new UpdateDelayAction(new RegistrationRepository(), new Trenitalia(), console.log)

  let response = await action.execute(new Date(), 60)
  console.log("update delays handler response: ", response)
}