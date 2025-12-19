const request = require('supertest')
const { app } = require('../index')
const { getDb, migrate } = require('../db')

describe('Courses API', function () {
  let db
  before(async function () {
    db = getDb()
    await migrate()
    await db('courses').del().catch(() => {})
    await require('../seeds/02_demo_courses').seed(db)
  })

  it('GET /courses returns seeded courses', async function () {
    const res = await request(app).get('/courses')
    if (res.status !== 200) throw new Error('expected 200')
    if (!Array.isArray(res.body) || res.body.length < 1) throw new Error('expected array of courses')
  })
})
