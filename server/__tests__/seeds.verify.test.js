const { getDb, migrate } = require('../db')

describe('Database seed verification', function () {
  let db

  before(async function () {
    db = getDb()
    await migrate()
    // ensure tables are in a clean state for deterministic seeding
    await db('submissions').del().catch(() => {})
    await db('assignments').del().catch(() => {})
    await db('questions').del().catch(() => {})
    await db('question_sets').del().catch(() => {})
    await db('courses').del().catch(() => {})
    await db('students').del().catch(() => {})
    await db('users').del().catch(() => {})

    // run the seeds in the same order as db_setup
    // small test-specific require to execute seed functions
    await require('../seeds/01_demo_users').seed(db)
    await require('../seeds/02_demo_courses').seed(db)
    await require('../seeds/03_demo_assignments').seed(db)
    await require('../seeds/04_demo_questions').seed(db)
  })

  it('inserts extra Computer Science courses (CS104-CS106)', async function () {
    const rows = await db('courses').whereIn('code', ['CS104', 'CS105', 'CS106'])
    if (!Array.isArray(rows) || rows.length < 3) throw new Error('expected 3 CS courses (CS104-CS106) to be seeded')
  })

  it('inserts questions for CS101-CS104', async function () {
    // ensure at least one question exists for CS101 and CS104 specifically
    const cs101 = await db('courses').where({ code: 'CS101' }).first()
    const cs104 = await db('courses').where({ code: 'CS104' }).first()

    if (!cs101 || !cs104) throw new Error('required courses not found')

    const q1 = await db('questions').where({ course_id: cs101.id }).limit(1)
    const q2 = await db('questions').where({ course_id: cs104.id }).limit(1)

    if (!q1 || q1.length === 0) throw new Error('expected at least one question for CS101')
    // Check specific Python questions exist (creator / release / PEP)
    const creatorQ = await db('questions').where({ course_id: cs101.id, title: 'Python Creator' }).first()
    if (!creatorQ) throw new Error('expected Python Creator question to be seeded')
    const pepQ = await db('questions').where({ course_id: cs101.id, title: 'PEP Meaning' }).first()
    if (!pepQ) throw new Error('expected PEP Meaning question to be seeded')
    if (!q2 || q2.length === 0) throw new Error('expected at least one question for CS104')
  })
})
