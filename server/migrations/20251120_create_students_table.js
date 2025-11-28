exports.up = function (knex) {
  return knex.schema.createTable('students', function (table) {
    table.increments('id').primary()
    table.string('email').notNullable().unique()
    table.string('password_hash').notNullable()
    table.string('name').notNullable()
    table.string('class')
    table.string('role').notNullable().defaultTo('student')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('students')
}
