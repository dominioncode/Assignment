require('dotenv').config()
// load server/.env too (dev creds are kept in server/.env)
require('dotenv').config({ path: './server/.env' })
const client = process.env.DB_CLIENT || process.env.DATABASE_CLIENT || 'mysql2'

const config = {
  development: {},
  production: {},
}

if (client === 'mysql2' || client === 'mysql') {
  const port = process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306
  config.development = {
    client: 'mysql2',
    connection: {
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'assignment_dev',
      port,
    },
    migrations: {
      directory: './server/migrations',
    },
    seeds: {
      directory: './server/seeds',
    },
  }

  config.production = {
    client: 'mysql2',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './server/migrations',
    },
    seeds: {
      directory: './server/seeds',
    },
  }
} else {
  // default to sqlite3 for local development
  config.development = {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_FILE || './server/dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './server/migrations',
    },
    seeds: {
      directory: './server/seeds',
    },
  }

  config.production = {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_FILE || './server/dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './server/migrations',
    },
  }
}

module.exports = config
