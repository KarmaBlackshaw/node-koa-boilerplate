// node
const util = require('util')
const cp = require('child_process')

// libs
const chalk = require('chalk')
const port = require('../utilities/port')

;(async () => {
  const freePort = await port.getFree()

  cp
    .spawn('clip')
    .stdin
    .end(util.inspect(freePort))

  console.log(`
    Copied: ${chalk.cyan(freePort)}
  `)
})()
