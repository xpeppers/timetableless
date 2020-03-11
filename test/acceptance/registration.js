const { equal, deepEqual } = require('assert')
const axios = require('axios').default

describe('Registration', () => {
  it('Calls registration endpoint without errors', async () => {
    return axios.post("http://localhost:3000/registration", {email:'pippo@it.clara.net', trainNumber:'4640', station:'S00461'})
    .then((response) => {
      deepEqual(response.data, "Registration")
    })
  })
})
