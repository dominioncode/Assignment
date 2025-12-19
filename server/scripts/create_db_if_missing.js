const mysql = require('mysql2/promise')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

async function createDbIfMissing() {
  const client = process.env.DB_CLIENT || 'mysql2'
  if (!(client === 'mysql2' || client === 'mysql')) {
    console.log('DB_CLIENT is not MySQL — skipping DB creation script')
    return
  }

  const host = process.env.MYSQL_HOST || 'localhost'
  const port = parseInt(process.env.MYSQL_PORT || '3306', 10)
  const user = process.env.MYSQL_USER || 'root'
  // If MYSQL_PASSWORD is unset or empty we still pass it to the connector (common for XAMPP)
  const password = typeof process.env.MYSQL_PASSWORD === 'undefined' ? '' : process.env.MYSQL_PASSWORD
  const dbName = process.env.MYSQL_DATABASE || 'assignment_dev'

  try {
    const conn = await mysql.createConnection({ host, port, user, password })
    console.log(`Connected to MySQL @ ${host}:${port} as ${user}`)
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    console.log(`Database ensured: ${dbName}`)
    await conn.end()
  } catch (err) {
    console.error('Failed to create database:', err && err.message ? err.message : err)
    process.exitCode = 1
  }
}

if (require.main === module) {
  // allow the script to run standalone
  createDbIfMissing()
}

module.exports = { createDbIfMissing }
