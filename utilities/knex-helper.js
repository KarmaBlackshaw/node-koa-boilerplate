const knex = require('@config/knex')

// utilities
const { getKey } = require('@utilities/object')
const moment = require('@utilities/moment')

// libraries
const _isNil = require('lodash/isNil')
const _isPlainObject = require('lodash/isPlainObject')
const _size = require('lodash/size')
const _isString = require('lodash/isString')
const _isArray = require('lodash/isArray')

// helpers
const isDate = date => !isNaN(new Date(date).getTime())

function raw (qb) {
  return knex.raw(qb)
}

/**
  Usage:

  const filterDictionary = {
    id: 'res.id',
    fname: 'res.fname',
    mname: 'res.mname',
    lname: 'res.lname',
    name: ['res.fname', 'res.mname', 'res.lname']
  }

  const sortDictionary = {
    id: 'res.id',
    fname: 'res.fname',
    mname: 'res.mname',
    lname: 'res.lname',
  }

  const dateDictionary = {
    created_at: 'users.created_at'
  }

  makeQuery({
    ...{ filterBy, q, filterDictionary },
    ...{ sortBy, sort, sortDictionary },
    ...{ dateBy, dateFrom, dateTo, dateDictionary },
    ...{ page, rows },
    knex,
    isCount
  })

  API
  @param {array|string} sortBy      ex: ['fname', 'lname'] or 'fname'
  @param {array|string} sort        ex: ['asc', 'desc'] or 'asc'
  @param {number} page              ex: 1
  @param {number} rows              ex: 50
  @param {array|string} filterBy    ex: ['fname', 'mname'] or 'fname'
  @param {array|string} q           ex: ['foo', 'bar'] or 'foo'

  EXAMPLE
  http://localhost:4002/samples?rows=100&page=1&date_by=created_at&date_from=2021-07-06&date_to=2021-07-10&sort_by=amount&sort=desc&sort_by=login_id&sort=asc&filter_by=login_id&q=ndm&filter_by=login_id&q=104
  */
function makeQuery ({ knex, filterBy, q, filterDictionary, page, rows, sortBy, sort, sortDictionary, dateBy, dateFrom, dateTo, dateDictionary, isCount }) {
  /**
     * PAGE AND ROWS
     */
  if (Number(page) && Number(rows) && !isCount) {
    knex.limit(rows)
      .offset(rows * (page - 1))
  }

  /**
     * SORTING
     */
  if (!isCount && sort && sortBy && _size(sortDictionary)) {
    (() => {
      const sortDirections = new Set(['asc', 'desc'])

      if (_isArray(sortBy) && _isArray(sort)) {
        for (let i = 0; i < sortBy.length; i++) {
          const currSortBy = sortBy[i]
          const sortDirection = sort[i]

          if (!sortDirections.has(sortDirection)) {
            continue
          }

          if (!sortDictionary[currSortBy]) {
            continue
          }

          knex.orderBy(currSortBy, sortDirection)
        }

        return knex
      }

      if (_isString(sortBy) && _isString(sort)) {
        if (!sortDirections.has(sort)) {
          return
        }

        if (!sortDictionary[sortBy]) {
          return
        }

        knex.orderBy(sortBy, sort)

        return knex
      }
    })()
  }

  /**
     * DATE RANGE
     */
  if (dateBy && dateFrom && dateTo && dateDictionary) {
    (() => {
      if (dateDictionary[dateBy] && isDate(dateFrom) && isDate(dateTo)) {
        const hasTime = date => Number(moment(date).format('HHmmss')) > 0
        const format = 'YYYY-MM-DD HH:mm:ss'

        const dateFromTimestamp = hasTime(dateFrom)
          ? moment(dateFrom).format(format)
          : moment(dateFrom).startOf('day').format(format)

        const dateToTimestamp = hasTime(dateTo)
          ? moment(dateTo).format(format)
          : moment(dateTo).endOf('day').format(format)

        knex.where(dateBy, '>=', dateFromTimestamp)
        knex.where(dateBy, '<=', dateToTimestamp)
      }
    })()
  }

  /**
     * FILTER
     */
  if (filterBy && q && filterDictionary) {
    (() => {
      if (_isArray(filterBy) && _isArray(q)) {
        knex.where(function () {
          for (let i = 0; i < q.length; i++) {
            const currQ = q[i]
            const currFilter = filterDictionary[filterBy[i]]

            if (!currQ || !currFilter) {
              continue
            }

            if (_isArray(currFilter)) {
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

        return knex
      }

      if (filterDictionary[filterBy] && _isString(q)) {
        return knex.where(filterDictionary[filterBy], 'like', `%${q}%`)
      }
    })()
  }
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
    .join(', ')

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
  makeQuery,
  findBy,
  jsonObject,
  jsonExtract,
  wrapCase
}
