/*
 * TODO - Enter handler description here...
 * Validations and conditions are applied here...
 * @handler  {{ pascalCase name }}
*/

const router = require('koa-router')()

// store
const Sample = require('@store/sample')

// utilities

// libraries
const Joi = require('joi')
const _get = require('lodash/get')

// middlewares
const authentication = require('@middleware/authentication')

router
  .prefix('/sample')

  .use(authentication())

  .get('/', async ctx => {
    try {
      const request = ctx.request.query

      const params = {
        filterBy: request.filter_by,
        q: request.q,
        sortBy: request.sort_by,
        sort: request.sort,
        dateBy: request.date_by,
        dateFrom: request.date_from,
        dateTo: request.date_to
      }

      const count = await Sample.index({ ...params, isCount: 1 })
      const list = await Sample.index({ ...params })

      ctx.body = { count: _get(count, 'total', 0), list }
    } catch (error) {
      ctx.throw(error)
    }
  })

  .post('/', async ctx => {
    const schema = Joi.object({
      //
    })

    try {
      const request = await schema.validateAsync(ctx.request.body)

      await Sample.store({
        //
      })

      ctx.status = 200
    } catch (error) {
      ctx.throw(error)
    }
  })

module.exports = router
