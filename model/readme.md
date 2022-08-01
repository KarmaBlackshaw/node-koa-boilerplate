The `model` directory contains all of your "Model" modules. Each database table has a corresponding "Model" which is used to interact with that table. Models allow you to query for data in your tables, as well as insert new records into the table. Models should have no logic implemented on them.

Sample code:
```js
// store
const knex = require('@config/knex')
const redis = require('@config/redis')

// utilities
const { makeQuery } = require('@utilities/knex-helper')

// libs
const _isEmpty = require('lodash/isEmpty')
const _isNil = require('lodash/isNil')
const _castArray = require('lodash/castArray')
const _pickBy = require('lodash/pickBy')
const _get = require('lodash/get')

// helpers

module.exports = {
  async list ({
    filter_by: filterBy,
    q,
    page,
    rows,
    sort_by: sortBy,
    sort,
    is_count: isCount,
    date_by: dateBy,
    date_from: dateFrom,
    date_to: dateTo
  } = {}) {
    const filterDictionary = {}

    const sortDictionary = {
      login_id: 'users.login_id',
      login_name: 'users.login_name',
      amount: 'users.amount'
    }

    const dateDictionary = {
      created_at: 'users.created_at'
    }

    try {
      const list = await knex('users')
        .modify(knex => {
          makeQuery({
            ...{ filterBy, q, filterDictionary },
            ...{ sortBy, sort, sortDictionary },
            ...{ dateBy, dateFrom, dateTo, dateDictionary },
            ...{ page, rows },
            knex,
            isCount
          })

          if (isCount) {
            knex
              .count({ total: 'users.id' })
              .first()
          } else {
            knex.select({
              id: 'users.id',
              login_id: 'users.login_id',
              login_name: 'users.login_name',
              amount: 'users.amount',
              created_at: 'users.created_at'
            })
          }
        })

      if (isCount) {
        return _get(list, 'total', 0)
      }

      return list
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async find (conditions) {
    const dictionary = {
      id: 'users.id',
      type_id: 'users.type_id',
      name: 'users.name',
      table: 'users.table'
    }

    try {
      const data = await knex('users')
        .modify(knex => {
          if (_isEmpty(conditions)) {
            knex.whereRaw('1 = 0')
          }

          for (const key in conditions) {
            const curr = conditions[key]

            if (dictionary[key] && !_isNil(curr)) {
              knex.where(dictionary[key], curr)
            }
          }

          if (conditions.is_deleted) {
            knex.whereNotNull('users.deleted_at')
          } else {
            knex.whereNull('users.deleted_at')
          }
        })
        .select({
          id: 'users.id',
          type_id: 'users.type_id',
          name: 'users.name',
          table: 'users.table'
        })
        .first()

      return data
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async store (payload) {
    const fillables = new Set([
      'foo',
      'bar'
    ])

    try {
      const arrayPayload = _castArray(payload)
      const filterer = hay => _pickBy(hay, (val, key) => !_isNil(val) && fillables.has(key))
      const data = arrayPayload.map(filterer)

      const [id] = await knex('users').insert(data)

      return id
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async modify (id, payload) {
    try {
      const dictionary = {
        foo: 'users.foo'
      }

      const updateData = {}
      for (const key in payload) {
        const updateValue = payload[key]
        const currDictionary = dictionary[key]

        if (_isNil(updateValue) || !currDictionary) {
          continue
        }

        updateData[currDictionary] = updateValue
      }

      if (_isEmpty(updateData)) {
        return
      }

      await knex({ tbl: 'users' })
        .where('tbl.id', id)
        .update(updateData)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

```