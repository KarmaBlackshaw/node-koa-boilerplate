// store
const Tests = require('@store/tests')

// utilities
const { createSearchQuery } = require('@utilities/search-query')

// libraries
const Joi = require('joi')

module.exports = ({ router }) => router
  .prefix('/tests')

  .get('/', async ctx => {
    try {
      const query = ctx.request.query
      const params = {
        ...createSearchQuery(query)
      }

      const list = await Tests.list({
        ...params
      })

      const total = await Tests.list({
        ...params,
        is_count: true
      })

      ctx.body = { total, list }
    } catch (error) {
      console.log(error)
      ctx.throw(error)
    }
  })

  .get('/find', async ctx => {
    try {
      ctx.body = await Tests.find(ctx.request.query)

      ctx.status = 200
    } catch (error) {
      console.log(error)
      ctx.throw(error)
    }
  })

  .post('/', async ctx => {
    const schema = Joi.object({
      start_date: Joi.date()
        .optional(),
      end_date: Joi.date()
        .optional(),
      profit: Joi.number()
        .required()
    })

    try {
      const request = await schema.validateAsync(ctx.request.body)

      ctx.body = await Tests.store({
        start_date: request.start_date,
        end_date: request.end_date,
        profit: request.profit
      })
    } catch (error) {
      console.log(error)
      ctx.throw(error)
    }
  })

  .patch('/', async ctx => {
    const schema = Joi.object({
      id: Joi.number()
        .required()
    })

    try {
      const data = await schema.validateAsync(ctx.request.body)

      ctx.body = await Tests.modify(data.id, {})
    } catch (error) {
      console.log(error)
      ctx.throw(error)
    }
  })

  .delete('/', async ctx => {
    const schema = Joi.object({
      id: Joi.number()
        .required()
    })

    try {
      const data = await schema.validateAsync(ctx.request.body)

      await Tests.modify(data.id, {
        deleted_at: new Date()
      })

      ctx.status = 200
    } catch (error) {
      console.log(error)
      ctx.throw(error)
    }
  })
