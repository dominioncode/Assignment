#!/usr/bin/env node
const mysql = require('mysql2/promise')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') })

async function main() {
  const client = process.env.DB_CLIENT || process.env.DATABASE_CLIENT || 'sqlite3'
  if (client === 'mysql2' || client === 'mysql') {
    const host = process.env.MYSQL_HOST || 'localhost'
    const port = parseInt(process.env.MYSQL_PORT || '3306', 10)
    const user = process.env.MYSQL_USER || 'root'
    const password = process.env.MYSQL_PASSWORD || ''
    const db = process.env.MYSQL_DATABASE || 'assignment_dev'

    console.log('Dropping MySQL database', db, 'on', `${host}:${port}`)
    const conn = await mysql.createConnection({ host, port, user, password })
    await conn.query(`DROP DATABASE IF EXISTS \`${db}\``)
    console.log('Dropped database (if existed):', db)
    await conn.end()
    return
  }

  if (client === 'sqlite3') {
    const fs = require('fs')
    const dbFile = process.env.DATABASE_FILE || path.join(__dirname, '..', 'server', 'dev.sqlite3')
    if (fs.existsSync(dbFile)) {
      fs.unlinkSync(dbFile)
      console.log('Removed sqlite file:', dbFile)
    } else {
      console.log('SQLite file not present:', dbFile)
    }
    return
  }

  console.warn('Unknown DB_CLIENT value — no action taken')
}

main().catch((err) => {
  console.error('Failed to drop database:', err.message || err)
  process.exit(1)
})
