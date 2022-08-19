const knex = require('@config/knex')

// utilities
const { getKey } = require('@utilities/object')

// libraries
const _isNil = require('lodash/isNil')
const _isPlainObject = require('lodash/isPlainObject')

function raw (qb) {
  return knex.raw(qb)
}

/**
  const dictionary = {
    id: 'res.id',
    fname: 'res.fname',
    mname: 'res.mname',
    lname: 'res.lname',
  }

  findBy({
    ...{ filterBy, q, dictionary },
    knex
  })

  API
  @param {array|string} filterBy    ex: ['fname', 'mname'] or 'fname'
  @param {array|string} q           ex: ['foo', 'bar'] or 'foo'

  */
function findBy ({ knex, filterBy, q, dictionary }) {
  try {
    const filterByColumn = getKey(filterBy, dictionary)
    let hasFilter = false

    if (filterByColumn && !_isNil(q)) {
      hasFilter = true
      knex.where(filterByColumn, q)
    }

    if (_isPlainObject(filterBy)) {
      for (const key in filterBy) {
        if (dictionary[key] && !_isNil(filterBy[key])) {
          hasFilter = true
          knex.where(dictionary[key], filterBy[key])
        }
      }
    }

    if (!hasFilter) {
      knex.whereRaw('0 = 1')
    }

    knex.first()
  } catch (error) {
    throw error
  }
}

function jsonObject (data) {
  const cols = Object.entries(data)
    .map(([key, value]) => `"${key}", ${value}`)
    .join(',  ')

  return raw(`JSON_OBJECT(${cols})`)
}

function jsonExtract (column, key) {
  return raw(`JSON_EXTRACT(${column}, '$."${key}"')`)
}

function wrapCase (caseStatements) {
  return raw(`(CASE ${caseStatements} END)`)
}

module.exports = {
  raw,
  findBy,
  jsonObject,
  jsonExtract,
  wrapCase
}
