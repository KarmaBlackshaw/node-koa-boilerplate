const router = require('koa-router')()

/**
 * Change necessarily and remove this comment
 */
// store
const Samples = require('@store/samples')

// utilities

// libraries
const Joi = require('joi')
const _get = require('lodash/get')

// middlewares
const authentication = require('@middleware/authentication')
// const userLevel = require('@middleware/userLevel')

module.exports = router
  .prefix('/samples')

  .use(authentication())

  .get('/', async ctx => {
    try {
      try {
        const query = ctx.request.query
        const params = {
          filterBy: query.filter_by,
          q: query.q,
          page: query.page,
          rows: query.rows,
          sortBy: query.sort_by,
          sort: query.sort,
          dateBy: query.date_by,
          dateFrom: query.date_from,
          dateTo: query.date_to,
          status: query.status,
          isCount: query.is_count
        }

        /**
         * Change necessarily and remove this comment
         */
        ctx.throw(404)

        /**
         * Change necessarily and remove this comment
         */
        const response = await Samples.list({ ...params })

        ctx.body = params.isCount ? _get(response, 'total', 0) : response
      } catch (err) {
        ctx.throw(err)
      }
    } catch (error) {
      ctx.throw(error)
    }
  })

  .post('/', async ctx => {
    /**
     * Change necessarily and remove this comment
     */
    const schema = Joi.object({
      start_date: Joi.date()
        .optional()
    })

    try {
      const request = await schema.validateAsync(ctx.request.body)

      /**
       * Change necessarily and remove this comment
       */
      ctx.throw(404)

      /**
       * Change necessarily and remove this comment
       */
      ctx.body = await Samples.store({
        start_date: request.start_date,
        end_date: request.end_date,
        profit: request.profit,
        minimum_net: request.minimum_net,
        is_active: request.is_active,
        status: request.status
      })
    } catch (err) {
      ctx.throw(err)
    }
  })

  .patch('/', async ctx => {
    /**
     * Change necessarily and remove this comment
     */
    const schema = Joi.object({
      id: Joi.number()
        .required()
    })

    try {
      const data = await schema.validateAsync(ctx.request.body)

      /**
       * Change necessarily and remove this comment
       */
      ctx.throw(404)

      /**
       * Change necessarily and remove this comment
       */
      ctx.body = await Samples.modify(data.id, {})
    } catch (err) {
      ctx.throw(err)
    }
  })

  .delete('/', async ctx => {
    const schema = Joi.object({
      id: Joi.number()
        .required()
    })

    try {
      const data = await schema.validateAsync(ctx.request.body)

      /**
       * Change necessarily and remove this comment
       */
      ctx.throw(404)

      /**
       * Change necessarily and remove this comment
       */
      await Samples.modify(data.id, {
        deleted_at: new Date()
      })

      ctx.status = 200
    } catch (err) {
      ctx.throw(err)
    }
  })
