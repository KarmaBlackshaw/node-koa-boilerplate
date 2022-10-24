require('../../config/module-alias')
require('@config/console')

module.exports = async function (globalConfig, projectConfig) {
  console.log(globalConfig.testPathPattern)
  console.log(projectConfig.cache)
}
