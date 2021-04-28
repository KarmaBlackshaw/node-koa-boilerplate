// stores
const store = require('@store')

// utiltiies
const { makeQuery } = require('@utilities/knexHelper')(store.knex)
const CustomError = require('@utilities/CustomError')

// libraries

// helpers
const getKey = (key, obj) => obj[key] === undefined ? obj.default : obj[key]

module.exports = {
  async index ({ filterBy, sortBy, dateBy, q, sort, dateFrom, dateTo, page, rows, isCount }) {
    try {
      const filterByColumn = getKey(filterBy, {
        user_id: 'users.id'
      })

      const sortByColumn = getKey(sortBy, {})
      const dateByColumn = getKey(dateBy, {})

      const list = await store.knex('users')
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
            knex.count({ total: '*' }).first()
          } else {
            knex.select({
              user_id: 'users.id',
              username: 'users.username',
              password: 'users.password'
            })
          }
        })

      return list
    } catch (error) {
      console.log(error)
      throw new CustomError(error)
    }
  },

  create () {
    // code here...
  },

  read () {
    // code here...
  },

  update () {
    // code here...
  },

  delete () {
    // code here...
  }
}
