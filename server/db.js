const path = require('path')
const dotenv = require('dotenv')

// load server/.env specifically to keep DB credentials scoped to server
dotenv.config({ path: path.join(__dirname, '.env') })

// prefer direct DB env vars for production+dev
const DB_CLIENT = process.env.DB_CLIENT || process.env.DATABASE_CLIENT || 'sqlite3'

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost'
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT || '3306', 10)
const MYSQL_USER = process.env.MYSQL_USER || 'root'
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || ''
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'assignment_dev'

const SQLITE_FILE = process.env.DATABASE_FILE || path.join(__dirname, 'dev.sqlite3')

let _db = null

function createDb() {
  // require knex lazily so Next.js build doesn't attempt to resolve optional
  // dialect adapters (oracledb, pg-query-stream, etc.) during webpack bundling.
  // use `eval('require')` so bundlers can't statically analyze the dependency
  // and attempt to include optional native drivers.
  const req = eval('require')
  const knex = req('knex')

  if (DB_CLIENT === 'mysql2' || DB_CLIENT === 'mysql') {
    return knex({
      client: 'mysql2',
      connection: {
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
      },
    })
  }

  // default to sqlite3 for local development
  return knex({
    client: 'sqlite3',
    connection: {
      filename: SQLITE_FILE,
    },
    useNullAsDefault: true,
  })
}

function getDb() {
  if (!_db) _db = createDb()
  return _db
}

// Ensure students table exists
async function migrate() {
  const db = getDb()
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

module.exports = { getDb, migrate }
