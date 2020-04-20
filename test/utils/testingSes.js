'use strict'

const fs = require('fs')
const path = require('path')

function TestingSES() {

  this.isReceived = () => {
    let p = path.resolve(__dirname, "../../output")
    return fs.readdirSync(p).length > 0
  }

  this.received = () => {
    let p = path.resolve(__dirname, "../../output", today())
    let folder = p + "/" + fs.readdirSync(p)[0]
    return {
      headers: toObject(fs.readFileSync(folder + "/" + "headers.txt", 'utf8')),
      body: fs.readFileSync(folder + "/" + "body.html", 'utf8')
    }
  }

  this.cleanUp = () => {
    let p = path.resolve(__dirname, "../../output")
    try {
      deleteFolderRecursive(p)
      fs.mkdirSync(path.resolve(__dirname, "../../output"))
    } catch(e) {
      console.log("**************************")
      console.log(e)
    }
  }

  function toObject(text) {
    return text
      .split("\n")
      .map(row => row.split(": "))
      .reduce((acc, [key, value]) => {
          acc[key.split(" ").join("")] = value
          return acc
      }, {})
  }

  function today() {
    let date = new Date()
    return date.getFullYear() + "-" + month(date) + "-" + date.getDate()
  }

  function month(date) {
    let month = date.getMonth() + 1

    return (month < 10) ? ("0" + month) : month
  }

  function deleteFolderRecursive(path) {
    if(fs.existsSync(path) ) {
      fs.readdirSync(path).forEach((file) => {
        var curPath = path + "/" + file
        if(fs.lstatSync(curPath).isDirectory()) {
            deleteFolderRecursive(curPath)
        } else {
            fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    }
  }
}

module.exports.TestingSES = TestingSES