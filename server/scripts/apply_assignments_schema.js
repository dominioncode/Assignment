const fs = require('fs')
const path = require('path')
const { getDb } = require('../db')

async function apply() {
  const db = getDb()
  const sqlPath = path.join(__dirname, '..', 'schema', 'assignments.sql')
  if (!fs.existsSync(sqlPath)) {
    console.error('Schema file not found:', sqlPath)
    process.exit(1)
  }

  const sql = fs.readFileSync(sqlPath, 'utf8')

  // Split statements by semicolon but naive split is fine for this schema
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  for (const stmt of statements) {
    // Skip database creation if not permitted — the DB connection already targets a database
    if (/CREATE\s+DATABASE/i.test(stmt)) continue
    try {
      await db.raw(stmt)
      console.log('Executed statement:', stmt.split('\n')[0].slice(0, 120))
    } catch (e) {
      console.warn('Statement failed (continuing):', (e && e.message) || e, '\nStatement snippet:', stmt.split('\n')[0].slice(0, 200))
    }
  }

  console.log('Finished applying assignments schema (best-effort)')
  process.exit(0)
}

apply().catch((err) => {
  console.error('Failed to apply schema', err && err.message ? err.message : err)
  process.exit(1)
})