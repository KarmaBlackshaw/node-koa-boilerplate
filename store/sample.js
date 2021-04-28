const store = require('@store')
const { makeQuery } = require('@utilities/knexHelper')(store.knex)
const getKey = (key, obj) => obj[key] === undefined ? obj.default : obj[key]

module.exports = {
  async index ({ filterBy, sortBy, dateBy, q, sort, dateFrom, dateTo, page, rows, isCount }) {
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
      })

    return list
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
