const request = require('supertest')
const { app } = require('../index')
const { getDb, migrate } = require('../db')

describe('Questions API', function () {
  let db
  let token
  let courseId

  before(async function () {
    db = getDb()
    await migrate()
    // clean relevant tables
    await db('question_sets').del().catch(() => {})
    await db('questions').del().catch(() => {})
    await db('assignments').del().catch(() => {})
    await db('courses').del().catch(() => {})
    await db('students').del().catch(() => {})

    // create a course used by tests
    const [cid] = await db('courses').insert({ code: 'TESTQ101', name: 'Test Question Course' })
    courseId = cid

    // register and login as lecturer to obtain token
    await request(app).post('/register').send({ email: 'lecturer_q@example.com', password: 'password', name: 'Lecturer Q', role: 'lecturer' })
    const loginRes = await request(app).post('/login').send({ email: 'lecturer_q@example.com', password: 'password' })
    if (loginRes.status !== 200) throw new Error('login failed')
    token = loginRes.body.token
  })

  it('creates, reads, updates and deletes a question', async function () {
    const createRes = await request(app).post('/questions').set('Authorization', `Bearer ${token}`).send({ title: 'Test Question', type: 'multiple-choice', course_id: courseId, text: 'Pick one', options: ['a','b'], correct_answer: 'a', marks: 2 })
    if (createRes.status !== 201) throw new Error('expected 201')
    const q = createRes.body

    const list = await request(app).get('/questions')
    if (list.status !== 200) throw new Error('expected 200')
    if (!Array.isArray(list.body) || !list.body.find((r) => r.id === q.id)) throw new Error('expected created question in list')

    const getRes = await request(app).get(`/questions/${q.id}`)
    if (getRes.status !== 200) throw new Error('expected 200')
    if (getRes.body.title !== 'Test Question') throw new Error('title mismatch')

    const updRes = await request(app).put(`/questions/${q.id}`).set('Authorization', `Bearer ${token}`).send({ title: 'Updated Question' })
    if (updRes.status !== 200) throw new Error('expected 200')
    if (updRes.body.title !== 'Updated Question') throw new Error('update failed')

    const delRes = await request(app).delete(`/questions/${q.id}`).set('Authorization', `Bearer ${token}`)
    if (![204, 200].includes(delRes.status)) throw new Error('expected 204/200')
  })

  it('creates and manipulates a question set', async function () {
    // create a question to include in set
    const createRes = await request(app).post('/questions').set('Authorization', `Bearer ${token}`).send({ title: 'Set Question', type: 'short-answer', course_id: courseId, text: 'Answer me', marks: 3 })
    if (createRes.status !== 201) throw new Error('expected 201')
    const q = createRes.body

    const csCreate = await request(app).post('/question_sets').set('Authorization', `Bearer ${token}`).send({ title: 'Test Set', description: 'set desc', course_id: courseId, questions: [q.id], total_marks: 3 })
    if (csCreate.status !== 201) throw new Error('expected 201')
    const setObj = csCreate.body

    const list = await request(app).get('/question_sets')
    if (list.status !== 200) throw new Error('expected 200')
    if (!Array.isArray(list.body) || !list.body.find((s) => s.id === setObj.id)) throw new Error('expected set in list')

    const upd = await request(app).put(`/question_sets/${setObj.id}`).set('Authorization', `Bearer ${token}`).send({ title: 'Updated Set' })
    if (upd.status !== 200) throw new Error('expected 200')
    if (upd.body.title !== 'Updated Set') throw new Error('update failed')

    const del = await request(app).delete(`/question_sets/${setObj.id}`).set('Authorization', `Bearer ${token}`)
    if (![200, 204].includes(del.status)) throw new Error('expected 200/204')
  })
})
