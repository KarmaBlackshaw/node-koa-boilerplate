// utilities
const { createSearchQuery } = require('@utilities/search-query')

// services
const userService = require('@modules/user/service')

// libraries
const Joi = require('joi')

module.exports = {
  async list (ctx) {
    const query = ctx.request.query
    const params = {
      ...createSearchQuery(query)
    }

    const list = await userService.list({
      ...params
    })

    const total = await userService.list({
      ...params,
      is_count: true
    })

    ctx.body = { total, list }
  },

  async find (ctx) {
    ctx.body = await userService.find(ctx.request.query)

    ctx.status = 200
  },

  async store (ctx) {
    const schema = Joi.object({
      start_date: Joi.date()
        .optional(),
      end_date: Joi.date()
        .optional(),
      profit: Joi.number()
        .required()
    })

    const request = await schema.validateAsync(ctx.request.body)

    ctx.body = await userService.store({
      start_date: request.start_date,
      end_date: request.end_date,
      profit: request.profit
    })
  },

  async patch (ctx) {
    const schema = Joi.object({
      id: Joi.number()
        .required()
    })

    const data = await schema.validateAsync(ctx.request.body)

    ctx.body = await userService.modify(data.id, {})
  },

  async delete (ctx) {
    const schema = Joi.object({
      id: Joi.number()
        .required()
    })

    const data = await schema.validateAsync(ctx.request.body)

    await userService.modify(data.id, {
      deleted_at: new Date()
    })

    ctx.status = 200
  }
}
