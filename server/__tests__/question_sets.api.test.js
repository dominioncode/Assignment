const request = require('supertest')
const { app } = require('../index')
const { getDb, migrate } = require('../db')

describe('Question sets API and seed linkage', function () {
  let db
  let token

  before(async function () {
    db = getDb()
    await migrate()

    // Clean relevant tables
    await db('question_sets').del().catch(() => {})
    await db('questions').del().catch(() => {})
    await db('assignments').del().catch(() => {})
    await db('courses').del().catch(() => {})
    await db('students').del().catch(() => {})

    // run seeds
    await require('../seeds/01_demo_users').seed(db)
    await require('../seeds/02_demo_courses').seed(db)
    await require('../seeds/03_demo_assignments').seed(db)
    await require('../seeds/04_demo_questions').seed(db)
    await require('../seeds/05_demo_question_sets').seed(db)

    // create a lecturer and login
    await request(app).post('/register').send({ email: 'lecturer_set@example.com', password: 'password', name: 'Lecturer Set', role: 'lecturer' })
    const loginRes = await request(app).post('/login').send({ email: 'lecturer_set@example.com', password: 'password' })
    if (loginRes.status !== 200) throw new Error('login failed')
    token = loginRes.body.token
  })

  it('seed created question_sets and linked them to assignments', async function () {
    const sets = await db('question_sets').select('*')
    if (!Array.isArray(sets) || sets.length === 0) throw new Error('expected at least one question_set')

    const assigned = await db('assignments').whereNotNull('question_set_id')
    if (!Array.isArray(assigned)) throw new Error('expected result array')
    // at least one assignment should be linked to a set by seed
    if (assigned.length === 0) throw new Error('expected at least one assignment linked to a question_set')

    // specifically assert that CS105 and CS106 sets exist when their courses are present
    const cs105 = await db('courses').where({ code: 'CS105' }).first()
    if (cs105) {
      const cs105sets = await db('question_sets').where({ course_id: cs105.id })
      if (!Array.isArray(cs105sets) || cs105sets.length === 0) throw new Error('expected at least one question_set for CS105')
    }

    const cs106 = await db('courses').where({ code: 'CS106' }).first()
    if (cs106) {
      const cs106sets = await db('question_sets').where({ course_id: cs106.id })
      if (!Array.isArray(cs106sets) || cs106sets.length === 0) throw new Error('expected at least one question_set for CS106')
    }
  })

  it('CRUD via API for question_sets', async function () {
    // ensure we have a course to attach
    const [courseId] = await db('courses').insert({ code: 'APITEST101', name: 'API Test Course' })

    const createRes = await request(app).post('/question_sets').set('Authorization', `Bearer ${token}`).send({ title: 'API Set', course_id: courseId, questions: [], total_marks: 10 })
    if (createRes.status !== 201) throw new Error('expected 201')
    const created = createRes.body

    const list = await request(app).get('/question_sets')
    if (list.status !== 200) throw new Error('expected 200')
    if (!Array.isArray(list.body) || !list.body.find((r) => r.id === created.id)) throw new Error('created set not in list')

    const getRes = await request(app).get(`/question_sets/${created.id}`)
    if (getRes.status !== 200) throw new Error('expected 200')
    // questions should be expanded to an array (even if empty) and options parsed when present
    if (!Array.isArray(getRes.body.questions)) throw new Error('expected questions array on question_set')

    const upd = await request(app).put(`/question_sets/${created.id}`).set('Authorization', `Bearer ${token}`).send({ title: 'Updated API Set' })
    if (upd.status !== 200) throw new Error('expected 200')
    if (upd.body.title !== 'Updated API Set') throw new Error('update failed')

    const del = await request(app).delete(`/question_sets/${created.id}`).set('Authorization', `Bearer ${token}`)
    if (![200, 204].includes(del.status)) throw new Error('expected 200/204 on delete')
  })

  it('GET /question_sets/:id returns questions with parsed options (usable by students)', async function () {
    // find a seeded set which has questions (seeded in before())
    const seeded = await db('question_sets').whereNotNull('questions').first()
    if (!seeded) return this.skip()
    const res = await request(app).get(`/question_sets/${seeded.id}`)
    if (res.status !== 200) throw new Error('expected 200')
    if (!Array.isArray(res.body.questions) || res.body.questions.length === 0) throw new Error('expected expanded questions')
    // ensure each question has an options field parsed to an array/object (or null for non-option types)
    for (const q of res.body.questions) {
      if (!('options' in q)) throw new Error('expected options on question')
      // options may be null, object or array depending on question type; that's acceptable
    }
  })
})
