/**
 * Usage

const errorHandler = require('@utilities/error-handler')

throw errorHandler({ name: 'VALIDATION_ERROR', message: 'hello world' })
 */

const logger = require('@config/logger')()

module.exports = err => {
  logger.error(err)
  console.log(err)
  return err
}
