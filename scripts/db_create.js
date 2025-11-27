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

    console.log('Creating MySQL database', db, 'on', `${host}:${port}`)
    const conn = await mysql.createConnection({ host, port, user, password })
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    console.log('Database created or already exists:', db)
    await conn.end()
    return
  }

  // sqlite case — create directory + file path (migrations will create tables)
  if (client === 'sqlite3') {
    const fs = require('fs')
    const dbFile = process.env.DATABASE_FILE || path.join(__dirname, '..', 'server', 'dev.sqlite3')
    const dir = path.dirname(dbFile)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '')
    console.log('SQLite DB created (file):', dbFile)
    return
  }

  console.warn('Unknown DB_CLIENT value — no action taken')
}

main().catch((err) => {
  console.error('Failed to create database:', err.message || err)
  process.exit(1)
})
