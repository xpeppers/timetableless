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
            Data: `<p>The train ${train} will leave from station ${station} with a delay of ${delay} minutes.</p>` +
                  `<br />` +
                  `<p style="font-size: 10px;">To unregister, <a href="${host}/registration/delete/${token}">click here</a>.</p>`
          },
          Text: {
            Charset: 'UTF-8',
            Data: `The train ${train} will leave from station ${station} with a delay of ${delay} minutes.` +
                  `To unregister, click on this link: ${host}/registration/delete/${token}`
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'News about your train'
        }
      }
    }
  }
}
