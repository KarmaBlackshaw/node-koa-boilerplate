const knex = require('@config/knex')

function raw (qb) {
  return knex.raw(qb)
}

function jsonExtract (column, key) {
  return raw(`JSON_EXTRACT(${column}, '$."${key}"')`)
}

function wrapCase (caseStatements) {
  return raw(`(CASE ${caseStatements} END)`)
}

function createFindArguments (payload) {
  const result = Object.entries(payload)
    .map(([key, value]) => ({
      field: key,
      operator: '=',
      value
    }))

  const query = {
    filter: {
      $and: result
    }
  }

  return query
}

module.exports = {
  createFindArguments,
  raw,
  jsonExtract,
  wrapCase
}
