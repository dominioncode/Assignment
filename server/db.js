const path = require('path')
const knex = require('knex')
const dotenv = require('dotenv')

dotenv.config()

const dbFile = process.env.DATABASE_FILE || path.join(__dirname, 'dev.sqlite3')

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbFile,
  },
  useNullAsDefault: true,
})

// Ensure students table exists
async function migrate() {
  const exists = await db.schema.hasTable('students')
  if (!exists) {
    await db.schema.createTable('students', (table) => {
      table.increments('id').primary()
      table.string('email').notNullable().unique()
      table.string('password_hash').notNullable()
      table.string('name').notNullable()
      table.string('class')
      table.string('role').notNullable().defaultTo('student')
      table.timestamps(true, true)
    })
    console.log('Created students table')
  }
}

module.exports = { db, migrate }
