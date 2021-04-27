const _isEmpty = require('lodash/isEmpty')
const store = require('@store')
const raw = qb => store.knex.raw(qb)

const isArray = item => item && Array.isArray(item)
const isNil = x => ['null', null, 'undefined', undefined].includes(x)

const knexHelper = {
  raw,

  jsonObject (data, isRaw) {
    const cols = Object
      .keys(data)
      .reduce((acc, curr) => [...acc, `"${curr}", ${data[curr]}`], [])
      .join(', ')
      .trim()

    return isRaw
      ? raw(`JSON_OBJECT(${cols})`)
      : `JSON_OBJECT(${cols})`
  },

  jsonExtract (column, key, raw) {
    return raw
      ? knexHelper.raw(`JSON_EXTRACT(${column}, '$.${key}')`)
      : `JSON_EXTRACT(${column}, '$.${key}')`
  },

  makeQuery ({
    knex,
    filterBy,
    q,
    page,
    rows,
    sortBy,
    sort,
    dateBy,
    dateFrom,
    dateTo,
    isCount,
    filterDictionary
  }) {
    if (Number(page) && Number(rows) && !isCount) {
      knex.limit(rows).offset(rows * (page - 1))
    }

    if (sortBy && sort) {
      if (isArray(sortBy)) {
        for (let i = 0; i < sortBy.length; i++) {
          const curr = sortBy[i]
          knex.orderBy(curr[0], curr[1])
        }
      } else {
        knex.orderBy(sortBy, sort)
      }
    }

    if (dateBy && dateFrom && dateTo) {
      knex.whereBetween(dateBy, [dateFrom, dateTo])
    }

    if (isArray(filterBy) && isArray(q) && filterDictionary) {
      for (let i = 0; i < q.length; i++) {
        const currQ = q[i]
        const currFilter = filterDictionary[filterBy[i]]

        if (!currQ || !currFilter) {
          continue
        }

        if (isArray(currFilter)) {
          knex.where(function () {
            for (let j = 0; j < currFilter.length; j++) {
              if (!isNil(currQ) && !isNil(currFilter[j])) {
                this.orWhere(currFilter[j], 'like', `%${currQ}%`)
              }
            }
          })
        } else {
          knex.where(currFilter, 'like', `%${currQ}%`)
        }
      }
    }
  },

  wrapCase (caseStatements, raw) {
    if (_isEmpty(caseStatements)) {
      throw new Error(`Case statements expected a value. Received ${caseStatements}`)
    }

    return raw
      ? knexHelper.raw(`(CASE ${caseStatements} END)`)
      : `(CASE ${caseStatements} END)`
  }
}

module.exports = knexHelper
