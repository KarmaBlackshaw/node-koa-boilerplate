// node
const util = require('util')
const cp = require('child_process')

// libs
const chalk = require('chalk')
const { v4: uuidv4 } = require('uuid')

const key = uuidv4()

cp
  .spawn('clip')
  .stdin
  .end(util.inspect(key))

console.log(`
  Copied: ${chalk.cyan(key)}
`)
