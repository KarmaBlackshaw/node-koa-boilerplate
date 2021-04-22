/**
 * Usage
 *
 * const RngError = require('@utilities/RngError')
 *
 * throw new RngError({ name: 'VALIDATION_ERROR', message: 'hello world' })
 */

module.exports = class Karma extends Error {
  constructor (err) {
    super(err)
    this.name = err.name || 'Error'
    this.message = err.message || 'Internal Server Error'
    this.params = err.params || {}
    console.log(err)
  }
}
