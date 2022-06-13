const Joi = require('joi')
require('dotenv').config()

const env = {}

Object.defineProperty(env, 'validate', {
  async value () {
    const schema = Joi
      .object({
      /**
       * Database schema
       */
        DB_HOST: Joi.string()
          .required(),
        DB_USER: Joi.string()
          .required(),
        DB_PASS: Joi.string()
          .required(),
        DB_NAME: Joi.string()
          .required(),

        /**
       * Node environment
       */
        NODE_ENV: Joi.string()
          .optional(),

        APP_SECRET_KEY: Joi.string()
          .guid()
          .required(),
        APP_PORT: Joi.number()
          .required(),

        SOCKET_PORT: Joi.number()
          .required(),
        SOCKET_ENABLED: Joi.number()
          .required(),

        STATIC_ASSET_PATH: Joi.string()
          .required(),

        /**
       * Redis config
       */
        REDIS_HOST: Joi.string()
          .required(),
        REDIS_PORT: Joi.number()
          .required(),
        REDIS_ENABLED: Joi.number()
          .required(),

        /**
       * AWS config
       */
        AWS_ACCESS_KEY_ID: Joi.string()
          .optional()
          .allow(''),
        AWS_SECRET_KEY_ACCESS: Joi.string()
          .optional()
          .allow(''),
        AWS_REGION: Joi.string()
          .optional()
          .allow(''),
        AWS_BUCKET_NAME: Joi.string()
          .optional()
          .allow(''),

        JWT_EXPIRES_IN: Joi.string()
          .optional()
          .allow(''),
        JWT_SECRET_KEY: Joi.string()
          .required()
      })
      .options({ allowUnknown: true })

    try {
      const data = await schema.validateAsync(process.env)

      for (const key in data) {
        Object.defineProperty(env, key, {
          value: data[key],
          writable: false,
          enumerable: true,
          configurable: false
        })
      }

      return data
    } catch (error) {
      console.log(`[Env Validation]: ${error.message}`)
      throw error.message
    }
  },
  writable: false,
  configurable: false,
  enumerable: false
})

module.exports = env
