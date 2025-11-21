require('dotenv').config()

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_FILE || './server/dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './server/migrations',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './server/migrations',
    },
  },
}
