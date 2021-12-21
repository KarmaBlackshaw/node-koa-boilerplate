const store = require('@store')

// utilities
const CustomError = require('@utilities/custom-error')
const { makeQuery } = require('@utilities/knex-helper')

// libs
const _isEmpty = require('lodash/isEmpty')
const _isNil = require('lodash/isNil')
const _castArray = require('lodash/castArray')
const _pickBy = require('lodash/pickBy')

// helpers
const getKey = (key, obj) => obj[key] === undefined ? obj.default : obj[key]

module.exports = {
  async list ({ filterBy, q, page, rows, sortBy, sort, isCount, dateBy, dateFrom, dateTo } = {}) {
    /**
     * Change necessarily and remove this comment
     */
    const dictionary = {}

    /**
     * Change necessarily and remove this comment
     */
    const filterByColumn = getKey(filterBy, {
      ...dictionary
    })

    /**
     * Change necessarily and remove this comment
     */
    const sortByColumn = getKey(sortBy, {
      ...dictionary,
      id: 'cash.id'
    })

    /**
     * Change necessarily and remove this comment
     */
    const dateByColumn = getKey(dateBy, {
      ...dictionary,
      created_at: 'cash.created_at'
    })

    try {
      /**
       * Change necessarily and remove this comment
       */
      const query = store.knex({ cash: 'cashbacks' })
        .modify(knex => {
          makeQuery({
            ...{ filterBy: filterByColumn, q },
            ...{ sortBy: sortByColumn, sort },
            ...{ dateBy: dateByColumn, dateFrom, dateTo },
            ...{ page, rows },
            knex,
            isCount
          })

          if (isCount) {
            /**
             * Change necessarily and remove this comment
             */
            knex.count({ total: 'cash.id' }).first()
          } else {
            /**
             * Change necessarily and remove this comment
             */
            knex.select({
              id: 'cash.id'
            })
          }
        })

      const list = await query

      if (isCount) {
        return list
      }

      return list
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async find (conditions) {
    /**
     * Change necessarily and remove this comment
     */
    const dictionary = {
      id: 'games.id',
      type_id: 'games.type_id',
      name: 'games.name',
      table: 'games.table'
    }

    try {
      const data = await store.knex({ games: 'mini_games' })
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

          /**
           * Change necessarily and remove this comment
           */
          if (conditions.is_deleted) {
            knex.whereNotNull('games.deleted_at')
          } else {
            knex.whereNull('games.deleted_at')
          }
        })
        /**
         * Change necessarily and remove this comment
         */
        .select({
          id: 'games.id',
          type_id: 'games.type_id',
          name: 'games.name',
          table: 'games.table'
        })
        .first()

      return data
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async store (payload) {
    const errDefaults = { name: 'CREATE_ERROR', status: 400 }

    /**
     * Change necessarily and remove this comment
     */
    const fillables = new Set([
      'foo',
      'bar'
    ])

    try {
      const arrayPayload = _castArray(payload)
      const filterer = hay => _pickBy(hay, (val, key) => !_isNil(val) && fillables.has(key))
      const data = arrayPayload.map(filterer)

      /**
       * Change necessarily and remove this comment
       */
      const [id] = await store.knex('contacts').insert(data)

      return id
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new CustomError({ ...errDefaults, message: 'DUPLICATE', info: error.sqlMessage })
      }

      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new CustomError({ ...errDefaults, message: 'UNKNOWN_DATA' })
      }

      console.log(error)
      throw error
    }
  },

  async modify (id, payload) {
    try {
      /**
       * Change necessarily and remove this comment
       */
      const dictionary = {
        foo: 'tbl.foo'
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

      /**
       * Change necessarily and remove this comment
       */
      return store.knex({ tbl: 'table' })
        .where('tbl.id', id)
        .update(updateData)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
