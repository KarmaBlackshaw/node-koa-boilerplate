const router = require('koa-router')()
const sample = require('@store/sample')

// libraries
const _get = require('lodash/get')

module.exports = router
  .prefix('/sample')

  .get('/', async (ctx, next) => {
    try {
      const request = ctx.request.query
      const params = {
        filterBy: request.filterBy,
        q: request.q,
        sortBy: request.sortBy,
        sort: request.sort,
        dateBy: request.dateBy,
        dateFrom: request.dateFrom,
        dateTo: request.dateTo
      }

      const count = await sample.index({ ...params, isCount: 1 })
      const list = await sample.index({ ...params })

      ctx.body = { count: _get(count, 'total', 0), list }
    } catch (error) {
      ctx.throw(error)
    }
  })
