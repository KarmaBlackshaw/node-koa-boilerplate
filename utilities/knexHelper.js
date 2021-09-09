const store = require('@store')

// utilities
const { getKey, isPOJO } = require('@utilities/helpers')

// libraries
const _isEmpty = require('lodash/isEmpty')
const _isNil = require('lodash/isNil')

// helpers
const raw = qb => store.knex.raw(qb)
const isArray = item => item && Array.isArray(item)
const isDate = date => !isNaN(new Date(date).getTime())

const knexHelper = {
  raw,

  jsonObject (data, isRaw = 1) {
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

  /**
    Usage:
    const dictionary = {
      id: 'res.id',
      fname: 'res.fname',
      mname: 'res.mname',
      lname: 'res.lname'
    }

    const filterColumns = {
      ...dictionary,
      name: ['res.fname', 'res.mname', 'res.lname']
    }

    const sortColumns = {
      ...dictionary,
      alias: 'alias'
    }

    makeQuery({
      ...{ filterBy, q, filterColumns },
      ...{ sortBy, sort, sortColumns },
      ...{ page, rows },
      knex,
      isCount
    })
   */

  makeQuery ({ knex, filterBy, q, filterColumns, page, rows, sortBy, sort, sortColumns, dateBy, dateFrom, dateTo, dateColumns, isCount }) {
    if (Number(page) && Number(rows) && !isCount) {
      knex.limit(rows).offset(rows * (page - 1))
    }

    if (isArray(sortBy) && isArray(sort) && sortColumns && !isCount) {
      for (let i = 0; i < sortBy.length; i++) {
        const currSortBy = sortColumns[sortBy[i]]
        const currSort = sort[i]

        if (!currSortBy || !currSort) {
          continue
        }

        knex.orderBy(currSortBy, currSort)
      }
    }

    if (isArray(dateBy) && isArray(dateFrom) && isArray(dateTo) && dateColumns) {
      knex.where(function () {
        for (let i = 0; i < dateBy.length; i++) {
          const currDateBy = dateColumns[dateBy[i]]
          const currDateFrom = dateFrom[i]
          const currDateTo = dateTo[i]

          if (!isDate(currDateFrom) || !isDate(currDateTo) || !currDateBy) {
            continue
          }

          this.orWhereBetween(currDateBy, [currDateFrom, currDateTo])
        }
      })
    }

    if (isArray(filterBy) && isArray(q) && filterColumns) {
      knex.where(function () {
        for (let i = 0; i < q.length; i++) {
          const currQ = q[i]
          const currFilter = filterColumns[filterBy[i]]

          if (!currQ || !currFilter) {
            continue
          }

          if (Array.isArray(currFilter)) {
            this.where(function () {
              for (let j = 0; j < currFilter.length; j++) {
                this.orWhere(currFilter[j], 'like', `%${currQ}%`)
              }
            })

            continue
          }

          this.where(currFilter, 'like', `%${currQ}%`)
        }
      })
    }
  },

  findBy ({ knex, filterBy, q, dictionary }) {
    try {
      const filterByColumn = getKey(filterBy, dictionary)
      let counter = 0

      if (filterByColumn && !_isNil(q)) {
        counter++
        knex.where(filterByColumn, q)
      }

      if (isPOJO(filterBy)) {
        for (const key in filterBy) {
          if (dictionary[key] && !_isNil(filterBy[key])) {
            counter++
            knex.where(dictionary[key], filterBy[key])
          }
        }
      }

      if (!counter) {
        knex.whereRaw('0 = 1')
      }
    } catch (error) {
      throw error
    }
  },

  wrapCase (caseStatements, raw) {
    if (_isEmpty(caseStatements)) {
      throw new Error(`Case statements expected a value. Received ${caseStatements}`)
    }

    return raw
      ? raw(`(CASE ${caseStatements} END)`)
      : `(CASE ${caseStatements} END)`
  }
}

module.exports = knexHelper