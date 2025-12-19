const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const { createDbIfMissing } = require('./create_db_if_missing')
const { getDb, migrate } = require('../db')

async function runSeeds() {
  const db = getDb()
  const seedDir = path.join(__dirname, '..', 'seeds')
  const fs = require('fs')
  const files = fs.readdirSync(seedDir).filter((f) => f.endsWith('.js')).sort()
  for (const f of files) {
    const full = path.join(seedDir, f)
    try {
      const seedModule = require(full)
      console.log('Running seed', f)
      if (typeof seedModule.seed === 'function') await seedModule.seed(db)
      else if (typeof seedModule === 'function') await seedModule(db)
      else console.warn('No seed function in', f)
    } catch (err) {
      console.warn('Failed to run seed', f, err && err.message ? err.message : err)
    }
  }
}

async function main() {
  try {
    await createDbIfMissing()
    await migrate()

    // Safety: only run seeds when explicitly allowed to avoid accidental destructive
    // operations (seeds in this project often delete tables before inserting).
    // To run seeds, either pass `--force` as a CLI arg or set env var `DB_SETUP=true`.
    const allowSeeds = process.env.DB_SETUP === 'true' || process.argv.includes('--force')
    if (!allowSeeds) {
      console.log('Skipping seeds. To run seeds set DB_SETUP=true or pass --force')
      console.log('DB setup complete (migrations applied, seeds skipped)')
      return
    }

    console.log('Running seeds (force enabled)')
    await runSeeds()
    console.log('DB setup complete')
  } catch (err) {
    console.error('DB setup failed:', err && err.message ? err.message : err)
    process.exitCode = 1
  }
}

if (require.main === module) main()

module.exports = { main }
