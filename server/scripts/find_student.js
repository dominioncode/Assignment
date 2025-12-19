const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const { getDb } = require('../db')

async function find(email) {
  const db = getDb()
  const row = await db('students').where({ email }).first()
  if (!row) {
    console.log('No student found with email:', email)
  } else {
    // hide password_hash for output safety
    const { password_hash, ...rest } = row
    console.log('Student record:', rest)
  }
}

const email = process.argv[2] || process.env.EMAIL || 'alice@example.com'
find(email).then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1) })
