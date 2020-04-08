'use strict'

exports.EmailNotifier = function EmailNotifier(sender) {
  const AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-west-1' })

  this.notify = (recipient, train, station, delay, token) => send(params(recipient, train, station, delay, token))

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

  function params (recipient, train, station, delay, token) {
    return {
      Source: sender,
      Destination: { ToAddresses: [recipient] },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<p>The train ${train} will leave from station ${station} with a delay of ${delay} minutes.</p>` +
                  `<br />` +
                  `<p style="font-size: 10px;">To unregister, <a href="${process.env.base_host}/registration/delete/${token}">click here</a>.</p>`
          },
          Text: {
            Charset: 'UTF-8',
            Data: `The train ${train} will leave from station ${station} with a delay of ${delay} minutes.` +
                  `To unregister, click on this link: ${process.env.base_host}/registration/delete/${token}`
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
