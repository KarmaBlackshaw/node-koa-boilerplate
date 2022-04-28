/**

USAGE:

const helpers = require('@helpers')

*/

// libs
const fs = require('fs')
const path = require('path')
const minimatch = require('minimatch')

const exclude = [
  'index.js'
]

const helpers = () => {
  const files = fs.readdirSync(path.join(__dirname))
  const helpers = {}

  files.forEach(file => {
    try {
      const isExcluded = exclude.some(glob => !!minimatch(file, glob))

      if (isExcluded) {
        return
      }

      const fn = require(path.join(__dirname, file))

      helpers[fn.name] = fn
    } catch (error) {
      throw new Error(`Error on file jobs/items/${file}`)
    }
  })

  return helpers
}

module.exports = helpers()
