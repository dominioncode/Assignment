const path = require('path')
const { getDb } = require('../db')

async function check() {
  const db = getDb()
  try {
    // Check whether the current database exists via information_schema
    const dbNameRes = await db.raw("SELECT SCHEMA_NAME as name FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", [process.env.MYSQL_DATABASE || process.env.DATABASE || 'assignment_dev'])
    const rows = dbNameRes[0] && Array.isArray(dbNameRes[0]) ? dbNameRes[0] : dbNameRes
    const exists = rows && rows.length > 0
    console.log('Database exists:', exists, 'name:', process.env.MYSQL_DATABASE || 'assignment_dev')

    // Check tables
    const students = await db.schema.hasTable('students')
    const lecturers = await db.schema.hasTable('lecturers')
    console.log('Has table `students`:', students)
    console.log('Has table `lecturers`:', lecturers)

    if (students) {
      const hasEmail = await db.schema.hasColumn('students', 'email')
      const hasPassword = await db.schema.hasColumn('students', 'password_hash')
      console.log('`students` has email:', hasEmail, 'password_hash:', hasPassword)
      try {
        const countRes = await db('students').count('* as cnt').first()
        console.log('students count:', countRes && countRes.cnt)
      } catch (e) {
        console.warn('Could not query students table:', e && e.message)
      }
    }

    if (lecturers) {
      const hasEmail = await db.schema.hasColumn('lecturers', 'email')
      const hasPassword = await db.schema.hasColumn('lecturers', 'password_hash')
      console.log('`lecturers` has email:', hasEmail, 'password_hash:', hasPassword)
      try {
        const countRes = await db('lecturers').count('* as cnt').first()
        console.log('lecturers count:', countRes && countRes.cnt)
      } catch (e) {
        console.warn('Could not query lecturers table:', e && e.message)
      }
    }

    // Print a quick sample row from each table if present
    if (students) {
      try {
        const sample = await db('students').select('id','email','name').limit(5)
        console.log('Sample students rows:', sample)
      } catch (e) {
        console.warn('Could not fetch sample students rows:', e && e.message)
      }
    }
    if (lecturers) {
      try {
        const sample = await db('lecturers').select('id','email','name').limit(5)
        console.log('Sample lecturers rows:', sample)
      } catch (e) {
        console.warn('Could not fetch sample lecturers rows:', e && e.message)
      }
    }
  } catch (err) {
    const msg = err && typeof err === 'object' && 'message' in err ? err.message : err
    console.error('Database check failed:', msg)
    process.exitCode = 2
  } finally {
    // destroy knex to exit cleanly
    try { await getDb().destroy() } catch (e) {}
  }
}

check()
