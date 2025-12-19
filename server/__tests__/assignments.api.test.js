const request = require('supertest')
const { app } = require('../index')
const { getDb, migrate } = require('../db')

describe('Assignments API', function () {
  let db

  before(async function () {
    db = getDb()
    await migrate()
    // clean up any existing data for deterministic tests
    await db('submissions').del()
    await db('assignments').del()
    await db('courses').del()
  })

  it('creates, reads, updates and deletes an assignment', async function () {
    // create course
    const [courseId] = await db('courses').insert({ code: 'TEST101', name: 'Test Course' })

    // register a lecturer and login to get token
    await request(app).post('/register').send({ email: 'lecturer_api@example.com', password: 'password', name: 'Lecturer API', role: 'lecturer' })
    const loginRes = await request(app).post('/login').send({ email: 'lecturer_api@example.com', password: 'password' })
    if (loginRes.status !== 200) throw new Error('login failed')
    const token = loginRes.body.token

    // create assignment (authenticated as lecturer)
    const createRes = await request(app).post('/assignments').set('Authorization', `Bearer ${token}`).send({ title: 'Test Assignment', description: 'desc', course_id: courseId })
    if (createRes.status !== 201) throw new Error('expected 201')
    const created = createRes.body

    // fetch list (authenticated)
    const listRes = await request(app).get('/assignments').set('Authorization', `Bearer ${token}`)
    if (listRes.status !== 200) throw new Error('expected 200')
    if (!Array.isArray(listRes.body)) throw new Error('expected array')

    // fetch single
    const getRes = await request(app).get(`/assignments/${created.id}`).set('Authorization', `Bearer ${token}`)
    if (getRes.status !== 200) throw new Error('expected 200')
    if (getRes.body.title !== 'Test Assignment') throw new Error('title mismatch')

    // update
    const updRes = await request(app).put(`/assignments/${created.id}`).set('Authorization', `Bearer ${token}`).send({ title: 'Updated Title' })
    if (updRes.status !== 200) throw new Error('expected 200')
    if (updRes.body.title !== 'Updated Title') throw new Error('update failed')

    // create submission (student not necessary for test)
    // create submission as authenticated user (let's use the lecturer token for simplicity)
    const subRes = await request(app).post(`/assignments/${created.id}/submissions`).set('Authorization', `Bearer ${token}`).send({ submission_data: '{ "answer": "ok" }' })
    if (subRes.status !== 201) throw new Error('expected 201')

    // get submissions
    const subs = await request(app).get(`/assignments/${created.id}/submissions`).set('Authorization', `Bearer ${token}`)
    if (subs.status !== 200) throw new Error('expected 200')
    if (!Array.isArray(subs.body) || subs.body.length !== 1) throw new Error('expected one submission')

    // delete
    const delRes = await request(app).delete(`/assignments/${created.id}`).set('Authorization', `Bearer ${token}`)
    if (![204, 200].includes(delRes.status)) throw new Error('expected 204/200')
  })
})
