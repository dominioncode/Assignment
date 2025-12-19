require('dotenv').config()
const { getDb } = require('../db')
const db = getDb()

async function migrate() {
  console.log('Starting migration: move lecturer rows from students -> lecturers')
  const trx = await db.transaction()
  try {
    const rows = await trx('students').where({ role: 'lecturer' }).select('*')
    console.log(`Found ${rows.length} lecturer(s) stored in students table`)
    let moved = 0
    for (const r of rows) {
      // Check for existing lecturer with same email
      const existing = await trx('lecturers').where({ email: r.email }).first()
      if (existing) {
        console.warn(`Skipping ${r.email} — lecturer entry already exists in lecturers table (id=${existing.id})`)
        // Remove the duplicate student row to avoid confusion
        await trx('students').where({ id: r.id }).del()
        continue
      }

      await trx('lecturers').insert({
        email: r.email,
        password_hash: r.password_hash,
        name: r.name,
        department: null,
        title: null,
        created_by: null,
      })
      await trx('students').where({ id: r.id }).del()
      moved++
      console.log(`Moved ${r.email} -> lecturers`)    
    }

    await trx.commit()
    console.log(`Migration complete. ${moved} moved, ${rows.length - moved} skipped/removed.`)
  } catch (err) {
    await trx.rollback()
    console.error('Migration failed:', (err && err.message) || err)
    process.exit(1)
  }
}

migrate().catch((err) => {
  console.error('Failed to run migration:', err && err.message ? err.message : err)
  process.exit(1)
})
