'use strict'

const { SesClientBuilder } = require("./sesClientBuilder")

exports.EmailNotifier = function EmailNotifier(sender, sesClient = new SesClientBuilder().build()) {
  const AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })

  this.notify = (recipient, train, station, delay, token) => send(params(recipient, train, station, delay, token))

  function send(params) {
    return new Promise((resolve, reject) => {
      sesClient.sendEmail(params, function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  function params (recipient, train, station, delay, token) {
    let host = (process.env.base_host == "[object Object]") ? "http://localhost:3001" : process.env.base_host

    return {
      Source: sender,
      Destination: { ToAddresses: [recipient] },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<p>Il Treno ${train} lascerà la stazione ${station} con un ritardo di ${delay} minuti.</p>` +
                  `<br /><br />` +
                  `<p style="font-size: 10px;">Per eliminare la registrazione, <a href="${host}/registration/delete/${token}">clicca qui</a>.</p>`
          },
          Text: {
            Charset: 'UTF-8',
            Data: `Il Treno ${train} lascerà la stazione ${station} con un ritardo di ${delay} minuti.` +
                  `Per eliminare la registrazione, vai a questo indirizzo: ${host}/registration/delete/${token}`
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Aggiornamenti sul tuo treno'
        }
      }
    }
  }
}
