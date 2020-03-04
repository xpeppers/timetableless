'use strict'

exports.EmailNotifier = function EmailNotifier(sender) {
  const AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })

  this.notify = (recipient, train, station, delay) => send(params(recipient, train, station, delay))

  function send(params) {
    return new Promise((resolve, reject) => {
      new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params, function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  function params (recipient, train, station, delay) {
    return {
      Source: sender,
      Destination: { ToAddresses: [recipient] },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<p>The train ${train} will leave from station ${station} with a delay of ${delay} minutes.</p>`
          },
          Text: {
            Charset: 'UTF-8',
            Data: `The train ${train} will leave from station ${station} with a delay of ${delay} minutes.`
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