const request = require('supertest')
const { app } = require('../index')
const { getDb, migrate } = require('../db')

describe('Assignment details with question set', function () {
  let db

  before(async function () {
    db = getDb()
    await migrate()

    // clean relevant tables
    await db('submissions').del().catch(() => {})
    await db('assignments').del().catch(() => {})
    await db('questions').del().catch(() => {})
    await db('question_sets').del().catch(() => {})
    await db('courses').del().catch(() => {})
    await db('students').del().catch(() => {})

    // run seeds 01-06
    await require('../seeds/01_demo_users').seed(db)
    await require('../seeds/02_demo_courses').seed(db)
    await require('../seeds/03_demo_assignments').seed(db)
    await require('../seeds/04_demo_questions').seed(db)
    await require('../seeds/05_demo_question_sets').seed(db)
    await require('../seeds/06_link_assignments_question_sets').seed(db)
  })

  it('GET /assignments/:id returns question_set with questions', async function () {
    const some = await db('assignments').whereNotNull('question_set_id').first()
    if (!some) throw new Error('no assignment with question_set_id found')
    // request as a student (should NOT receive correct_answer fields)
    await request(app).post('/register').send({ email: 'stud_view@example.com', password: 'password', name: 'Student View', role: 'student' })
    const login = await request(app).post('/login').send({ email: 'stud_view@example.com', password: 'password' })
    const studentToken = login.body.token
    const res = await request(app).get(`/assignments/${some.id}`).set('Authorization', `Bearer ${studentToken}`)
    if (res.status !== 200) throw new Error('expected 200')
    if (!res.body.question_set) throw new Error('expected question_set in response')
    if (!Array.isArray(res.body.question_set.questions)) throw new Error('expected questions array on question_set')
    if (res.body.question_set.questions.length === 0) throw new Error('expected at least one question in question_set')
    // ensure students do not see correct_answer
    for (const q of res.body.question_set.questions) {
      if ('correct_answer' in q) throw new Error('student should not see correct_answer')
    }

    // request as a lecturer and ensure correct_answer is visible
    const lectLogin = await request(app).post('/login').send({ email: 'lecturer@example.com', password: 'demo123' })
    const lectToken = lectLogin.body.token
    const resL = await request(app).get(`/assignments/${some.id}`).set('Authorization', `Bearer ${lectToken}`)
    if (resL.status !== 200) throw new Error('expected 200')
    for (const q of resL.body.question_set.questions) {
      if (!('correct_answer' in q)) throw new Error('lecturer should see correct_answer')
    }
  })
})
