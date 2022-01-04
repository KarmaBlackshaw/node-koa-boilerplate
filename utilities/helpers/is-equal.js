/**

USAGE:

const isEqual = require('@helpers/is-equal')

*/

const _isArray = require('lodash/isArray')
const _isObject = require('lodash/isObject')

const isEqual = (original, latest) => {
  if (_isArray(original)) {
    for (let i = 0; i < original.length; i++) {
      const originalCurr = original[i]
      const latestCurr = latest[i]

      if (!isEqual(originalCurr, latestCurr)) {
        return false
      }
    }

    return true
  }

  if (_isObject(original)) {
    for (const key in original) {
      const originalCurr = original[key]
      const latestCurr = latest[key]

      if (!isEqual(originalCurr, latestCurr)) {
        return false
      }
    }

    return true
  }

  if (original != latest) {
    console.log(original, latest)
    console.log(`Failed at normal ${{ original, latest }}`)
    return false
  }

  return true
}

module.exports = isEqual
