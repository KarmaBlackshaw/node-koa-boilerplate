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

function createFindArguments (conditions) {
  const filterBy = []
  const q = []

  for (const key in conditions) {
    const value = conditions[key]

    filterBy.push(key)
    q.push(`"${value}"`)
  }

  return {
    filter_by: filterBy,
    q
  }
}

module.exports = {
  createFindArguments,
  raw,
  jsonExtract,
  wrapCase
}
