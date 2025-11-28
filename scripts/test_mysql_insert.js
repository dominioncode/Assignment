// quick script to run migrate and insert a test user into server DB
require('dotenv').config({ path: './server/.env' })
const serverDb = require('../server/db')
const bcrypt = require('bcryptjs')
;(async () => {
  try {
    await serverDb.migrate()
    const db = serverDb.getDb()
    const hash = await bcrypt.hash('mysqlpass', 10)
    const [id] = await db('students').insert({
      email: 'mysqluser2@example.com',
      password_hash: hash,
      name: 'MySQL User 2',
      class: null,
      role: 'student',
    })
    const user = await db('students').where({ email: 'mysqluser2@example.com' }).first()
    console.log('Inserted user id:', id)
    console.log('User row:', user)
    process.exit(0)
  } catch (err) {
    console.error('ERROR', err)
    process.exit(1)
  }
})()
