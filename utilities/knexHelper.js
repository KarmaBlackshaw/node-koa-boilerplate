const _flatten = require('lodash/flatten')
const _isEmpty = require('lodash/isEmpty')
const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

module.exports = knex => {
  const knexHelper = {
    raw: qb => knex.raw(qb),

    aliasify (obj) {
      const fields = ['id', ..._flatten(Object.values(obj))]
      const commons = fields.reduce((acc, curr) => fields.filter(x => x === curr).length > 1 ? [...acc, curr] : acc, [])

      const appendCommon = (alias, common) => {
        const newCommon = (common.length === 2 ? common.toUpperCase() : `_${common}`)
        return alias.toLowerCase() + newCommon
      }

      const alias = (array, alias) => array.map(x => {
        return commons.includes(x.toLowerCase()) && x !== '*'
          ? `${alias}.${x} as ${appendCommon(alias, x)}`
          : `${alias}.${x}`
      })

      return _flatten(Object.keys(obj).map(key => alias(obj[key], key)))
    },

    jsonObject ({ alias, data }) {
      const cols = Object
        .keys(data)
        .reduce((acc, curr) => [...acc, `"${curr}", ${data[curr]}`], [])
        .join(', ')
        .trim()

      return alias
        ? `JSON_OBJECT(${cols}) as ${alias}`
        : `JSON_OBJECT(${cols})`
    },

    _jsonObject (data, raw) {
      return raw
        ? knexHelper.raw(knexHelper.jsonObject({ data }))
        : knexHelper.jsonObject({ data })
    },

    jsonExtract (column, key, alias) {
      return alias
        ? `JSON_EXTRACT(${column}, '$.${key}') as ${alias}`
        : `JSON_EXTRACT(${column}, '$.${key}')`
    },

    rowNumber (column, { alias = 'rowNumber', order = 'asc' } = {}) {
      if (!column) {
        throw new Error(`rowNumber expected a value. Received ${column}`)
      }

      return alias
        ? `row_number() over (order by ${column} ${order}) as ${alias}`
        : `row_number() over (order by ${column} ${order})`
    },

    makeQuery ({ knex, filterBy, q, page, rows, sortBy, sort, dateBy, dateFrom, dateTo, isCount }) {
      if (Number(page) && Number(rows) && !isCount) {
        knex.limit(rows).offset(rows * (page - 1))
      }

      if (sortBy && sort) {
        if (Array.isArray(sortBy)) {
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

      if (filterBy && q) {
        if (Array.isArray(filterBy)) {
          knex.where(function () {
            for (let i = 0; i < filterBy.length; i++) {
              const curr = filterBy[i]
              isObject(curr)
                ? this.orWhere(curr.value, curr.operator, q)
                : this.orWhere(curr, 'LIKE', `%${q}%`)
            }
          })
        } else {
          const isFilterByObject = isObject(filterBy)

          if (isFilterByObject && filterBy.method === 'having') {
            if (filterBy.operator) {
              knex.having(filterBy.value, filterBy.operator, q)
            } else {
              knex.having(filterBy.value, 'LIKE', `%${q}%`)
            }
          } else if (isFilterByObject && filterBy.operator) {
            knex.where(filterBy.value, filterBy.operator, q)
          } else {
            knex.where(filterBy, 'LIKE', `%${q}%`)
          }
        }
      }
    },

    wrapCase (caseStatements) {
      if (_isEmpty(caseStatements)) {
        throw new Error(`Case statements expected a value. Received ${caseStatements}`)
      }

      return `(CASE ${caseStatements} END)`
    }
  }

  return knexHelper
}
