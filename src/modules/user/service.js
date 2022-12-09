// store
const knex = require('@config/knex')

// libs
const _ = require('lodash')

const { createFindArguments } = require('@utilities/knex-helper')

module.exports = {
  async list ({
    filter_by: filterBy,
    q,
    sort_by: sortBy,
    sort,
    page,
    rows,
    is_count: isCount,
    date_by: dateBy,
    date_from: dateFrom,
    date_to: dateTo,
    is_find: isFind
  } = {}) {
    const filterDictionary = {}

    const sortDictionary = {}

    const dateDictionary = {}

    try {
      const list = await knex('tests')
        .meta({
          ...{ filterBy, q, filterDictionary },
          ...{ sortBy, sort, sortDictionary },
          ...{ dateBy, dateFrom, dateTo, dateDictionary },
          ...{ page, rows },
          isCount
        })
        .modify(function () {
          if (isFind) {
            this.limit(1)
          }

          if (isCount) {
            this
              .count({ total: 'tests.id' })
              .first()
          } else {
            this.select({
              id: 'tests.id',
              login_id: 'tests.login_id',
              login_name: 'tests.login_name',
              amount: 'tests.amount',
              created_at: 'tests.created_at'
            })
          }
        })

      if (isCount) {
        return _.get(list, 'total', 0)
      }

      return list
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async find (conditions) {
    try {
      const data = await this.list({
        ...createFindArguments(conditions),
        is_find: true
      })

      return _.first(data)
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async store (payload) {
    const fillables = [
      'foo',
      'bar'
    ]

    try {
      const [id] = await knex('tests')
        .metaInsert(payload, fillables)

      return id
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async modify (id, payload) {
    try {
      const dictionary = {
        foo: 'tests.foo'
      }

      await knex({ tbl: 'tests' })
        .where('tbl.id', id)
        .metaUpdate(payload, dictionary)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
