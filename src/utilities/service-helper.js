const _ = require('lodash')

function castObjectFieldsToJson (payload, jsonFields) {
  const payloadArray = _.castArray(payload)
  const fieldset = new Set(jsonFields)

  payloadArray.forEach(curr => {
    for (const key in curr) {
      const fieldData = curr[key]

      if (fieldset.has(key) && _.isPlainObject(fieldData)) {
        curr[key] = JSON.stringify(fieldData)
      }
    }
  })

  return payloadArray
}

function makeFindArguments (filter) {
  return {
    query: {
      filter,
      pagination: {
        page: 1,
        rows: 1
      }
    }
  }
}

module.exports = {
  castObjectFieldsToJson,
  makeFindArguments
}
