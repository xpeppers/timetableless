const { ok } = require("assert")

describe('Notify Train Delays', () => {
  it('Train Delay One hour before start time', () => {

    // Dato: Alice registra per il treno X che prenderà alla stazione Y
    // POST `$baseUrl/register` -d '{"train":"S001", "station":"S00462"}'

    // Quando: Manca un ora alla partenza del treno
    ok (false)
  })
})


// Scenario: treno in ritardo 1h prima della partenza
// Dato: Alice registra per il treno X che prenderà alla stazione Y
// Quando: Manca un ora alla partenza del treno
// E: Il treno ha 5 minuti di ritardo
// Allora: Alice riceve una notifica