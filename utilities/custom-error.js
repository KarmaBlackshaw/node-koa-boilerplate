/**
 * Usage
 *
 * const CustomError = require('@utilities/CustomError')
 *
 * throw new CustomError({ name: 'VALIDATION_ERROR', message: 'hello world' })
 */

const {
  getKey
} = require('@utilities/object')

const _isString = require('lodash/isString')

module.exports = class CustomError extends Error {
  constructor (err) {
    super(err)

    if (_isString(err.message) && err.message.includes('Error:')) {
      const split = err.message.split(': ')

      this.name = split[0]
      this.message = split[1]
    } else {
      this.name = this.getName(err)
      this.message = this.getMessage(err)
    }

    if (err.code === 'ECONNREFUSED') {
      this.status = 500
      this.name = 'CONNECTION_ERROR'
      this.message = 'CANNOT_CONNECT_TO_SERVER'
    }

    this.status = err.status || 422
    this.params = err.params || {}
    this.info = err.info
  }

  getName ({ name }) {
    return getKey(name, {
      ValidationError: 'VALIDATION_ERROR',
      Error: 'INTERNAL_ERROR',
      default: name || 'INTERNAL_ERROR'
    })
  }

  getMessage ({ name, message }) {
    return getKey(name, {
      Error: 'Internal Server Error',
      default: message || 'Internal Server Error'
    })
  }
}
