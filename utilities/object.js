const _isNil = require('lodash/isNil')
const _isArray = require('lodash/isArray')
const _isObject = require('lodash/isObject')

function getKey (key, obj) {
  return _isNil(obj[key]) ? obj.default : obj[key]
}

function isEqual (original, latest) {
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

module.exports = {
  getKey,
  isEqual
}
