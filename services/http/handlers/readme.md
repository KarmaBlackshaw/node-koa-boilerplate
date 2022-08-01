The `handlers` directory contains all of the business logic. You will be using differend models here.

Sample code:
```js
// store
const Users = require('@model/users')

// utilities

// libraries
const Joi = require('joi')
const _get = require('lodash/get')

// middlewares
const authentication = require('@middleware/authentication')

module.exports = ({ router }) => router
  .prefix('/users')

  .use(authentication())

  .get('unauth', '/hello', async ctx => {
    ctx.body = 'Hello from users'
  })

  .get('/', async ctx => {
    try {
      const query = ctx.request.query
      const params = {
        filter_by: query.filter_by,
        q: query.q,
        page: query.page,
        rows: query.rows,
        sort_by: query.sort_by,
        sort: query.sort,
        date_by: query.date_by,
        date_from: query.date_from,
        date_to: query.date_to
      }

      const list = await Users.list({ ...params })
      const total = await Users.list({ ...params, isCount: true })

      ctx.body = { total, list }
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

      ctx.body = await Users.store({
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

      ctx.body = await Users.modify(data.id, {})
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

      await Users.modify(data.id, {
        deleted_at: new Date()
      })

      ctx.status = 200
    } catch (error) {
      console.log(error)
      ctx.throw(error)
    }
  })
```