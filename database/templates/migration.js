const TABLE_NAME = ''

exports.up = function (knex) {
  return knex.schema
    .createTable(TABLE_NAME, table => {
      table.increments()
        .unsigned()
      table.timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
      table.timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      table.timestamp('deleted_at')
    })
}

exports.down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME)
}
