/**
* TODO - Describe what this store does in general.
* CRUD Operations are done here...
* @module Sample
*/

// store
const store = require('@store')

// utilities
const CustomError = require('@utilities/custom-error')
const { getKey, isPOJO } = require('@utilities/helpers')
const { makeQuery } = require('@utilities/knex-helper')

// libraries
const _pickBy = require('lodash/pickBy')
const _isNil = require('lodash/isNil')
const _isEmpty = require('lodash/isEmpty')

// middlewares

// file-wide variables

module.exports = {
  async index ({ filterBy, q, page, rows, sortBy, sort, isCount }) {
    try {
      const dictionary = {
        sample_id: 'sample.id',
        sample: 'sample.name'
      }

      const filterColumns = {
        ...dictionary
      }

      const sortColumns = {
        ...dictionary
      }

      const query = store.knex('sample')
        .modify(knex => {
          makeQuery({
            ...{ filterBy, q, filterColumns },
            ...{ sortBy, sort, sortColumns },
            ...{ page, rows },
            knex,
            isCount
          })

          if (isCount) {
            knex.count({ total: 1 }).first()
          } else {
            knex.select({
              id: 'sample.id',
              name: 'sample.name'
            })
          }
        })

      const list = await query

      if (isCount) {
        return list
      }

      // parse JSON here

      return list
    } catch (error) {
      throw new CustomError(error)
    }
  },

  async store (payload) {
    const errDefaults = { name: 'REGISTER_ERROR', status: 400 }
    const fillables = new Set([
      'fname'
    ])

    try {
      const data = _pickBy(payload, (val, key) => !_isNil(val) && fillables.has(key))

      const [id] = await store.knex('sample').insert(data)

      return id
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new CustomError({ ...errDefaults, message: 'UNKNOWN_DATA' })
      }

      console.log(error)
      throw new CustomError(error)
    }
  },

  async findBy (filterBy, q) {
    const dictionary = {
      sample_id: 'sample.id',
      name: 'sample.name'
    }

    const filterByColumn = getKey(filterBy, dictionary)

    try {
      const data = await store.knex('sample')
        .modify(knex => {
          if (filterByColumn && !_isNil(q)) {
            knex.where(filterByColumn, q)
          }

          if (isPOJO(filterBy)) {
            for (const key in filterBy) {
              if (dictionary[key] && !_isNil(filterBy[key])) {
                knex.where(dictionary[key], filterBy[key])
              }
            }
          }
        })
        .select({
          sample_id: 'sample.id',
          name: 'sample.name'
        })
        .first()

      return data
    } catch (error) {
      throw error
    }
  },

  async modify (id, payload) {
    try {
      const dictionary = {
        sample_id: 'sample.id'
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

      await store.knex('sample')
        .where('sample.id', id)
        .update(updateData)

      return true
    } catch (error) {
      console.log(error)
      throw new CustomError(error)
    }
  }
}
