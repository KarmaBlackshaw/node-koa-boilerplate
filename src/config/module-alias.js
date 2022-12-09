// libs
const moduleAlias = require('module-alias')

// node core
const path = require('path')

// constants
const ROOT = process.cwd()

const jsconfig = require('../../jsconfig.json')

const aliases = Object.entries(jsconfig.compilerOptions.paths)
  .reduce((acc, entry) => {
    const name = entry[0]
      .replace(/\/\*$$/, '')

    const directory = entry[1][0]
      .replace(/(?:\.\/)(.+?)(?:\/\*)/g, '$1')

    return {
      ...acc,
      [name]: path.join(ROOT, ...directory.split('/'))
    }
  }, {})

moduleAlias.addAliases(aliases)

module.exports = moduleAlias
