const _ = require('lodash')

function createSearchQuery (query) {
  const toArrayIfExists = key => {
    const keyQuery = query[`${key}[]`] || query[key]

    return keyQuery && _.castArray(keyQuery)
  }

  return {
    filter_by: toArrayIfExists('filter_by'),
    q: toArrayIfExists('q'),
    sort_by: toArrayIfExists('sort_by'),
    sort: toArrayIfExists('sort'),
    page: query.page,
    rows: query.rows,
    date_by: query.date_by,
    date_from: query.date_from,
    date_to: query.date_to
  }
}

module.exports = {
  createSearchQuery
}
