const request = require('supertest')
const { app } = require('../index')
const { getDb, migrate } = require('../db')

describe('Assignment update API', function () {
  let db
  before(async function () {
    db = getDb()
    await migrate()
    await db('assignments').del().catch(() => {})
    await db('students').del().catch(() => {})
  })

  it('allows lecturer to update an assignment', async function () {
    // register and login lecturer
    await request(app).post('/register').send({ email: 'up_lect@example.com', password: 'password', name: 'Up Lect', role: 'lecturer' })
    const loginRes = await request(app).post('/login').send({ email: 'up_lect@example.com', password: 'password' })
    if (loginRes.status !== 200) throw new Error('login failed')
    const token = loginRes.body.token

    const createRes = await request(app).post('/assignments').set('Authorization', `Bearer ${token}`).send({ title: 'To Update', description: 'desc', course_id: null })
    if (createRes.status !== 201) throw new Error('create failed')
    const a = createRes.body

    const updRes = await request(app).put(`/assignments/${a.id}`).set('Authorization', `Bearer ${token}`).send({ title: 'Updated Title', total_marks: 42 })
    if (updRes.status !== 200) throw new Error('update failed')
    if (updRes.body.title !== 'Updated Title') throw new Error('title not updated')
    if (updRes.body.total_marks !== 42) throw new Error('marks not updated')
  })
})
