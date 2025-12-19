/*
 * Usage:
 *   node scripts/insert_student.js --email=foo@example.com --password=secret --name="Foo Bar" --class=CS1 --role=student
 * OR via environment variables: EMAIL, PASSWORD, NAME, CLASS, ROLE
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const { getDb } = require('../db')
const bcrypt = require('bcrypt')

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (const a of args) {
    const m = a.match(/^--([a-zA-Z_]+)=?(.*)$/)
    if (m) out[m[1]] = m[2]
  }
  return out
}

async function main() {
  const args = parseArgs()
  const email = args.email || process.env.EMAIL || 'new_student@example.com'
  const password = args.password || process.env.PASSWORD || 'welcome123'
  const name = args.name || process.env.NAME || 'New Student'
  const klass = args.class || process.env.CLASS || null
  const role = args.role || process.env.ROLE || 'student'

  if (!email || !password || !name) {
    console.error('email, password and name are required')
    process.exit(1)
  }

  const db = getDb()
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
  try {
    const hash = await bcrypt.hash(password, saltRounds)
    const [id] = await db('students').insert({ email, password_hash: hash, name, class: klass, role })
    console.log('Inserted student id:', id)
    process.exit(0)
  } catch (err) {
    console.error('Failed to insert student:', err && err.message ? err.message : err)
    process.exit(1)
  }
}

main()
