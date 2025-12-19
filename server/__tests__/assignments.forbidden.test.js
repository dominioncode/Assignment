const request = require('supertest')
const { app } = require('../index')
const { getDb, migrate } = require('../db')

describe('Assignments auth rules (forbidden for students)', function () {
  let db

  before(async function () {
    db = getDb()
    await migrate()
    await db('submissions').del()
    await db('assignments').del()
    await db('courses').del()
  })

  it('forbids non-lecturer from creating or modifying assignments', async function () {
    // create a course first (by bypassing API)
    const [courseId] = await db('courses').insert({ code: 'FBD101', name: 'Forbidden Course' })

    // register a student and login
    await request(app).post('/register').send({ email: 'student_api@example.com', password: 'password', name: 'Student API', role: 'student' })
    const loginRes = await request(app).post('/login').send({ email: 'student_api@example.com', password: 'password' })
    const token = loginRes.body.token

    // student should be forbidden from creating assignment
    const createRes = await request(app).post('/assignments').set('Authorization', `Bearer ${token}`).send({ title: 'Forbidden', course_id: courseId })
    if (createRes.status !== 403) throw new Error('expected 403 when student creates assignment')

    // create assignment as lecturer for update/delete tests
    await request(app).post('/register').send({ email: 'lecturer2@example.com', password: 'password', name: 'Lecturer 2', role: 'lecturer' })
    const loginL = await request(app).post('/login').send({ email: 'lecturer2@example.com', password: 'password' })
    const lecturerToken = loginL.body.token
    const createL = await request(app).post('/assignments').set('Authorization', `Bearer ${lecturerToken}`).send({ title: 'Allowed', course_id: courseId })
    const created = createL.body

    // student should be forbidden from updating
    const u = await request(app).put(`/assignments/${created.id}`).set('Authorization', `Bearer ${token}`).send({ title: 'Bad Update' })
    if (u.status !== 403) throw new Error('expected 403 when student updates assignment')

    // student should be forbidden from deleting
    const d = await request(app).delete(`/assignments/${created.id}`).set('Authorization', `Bearer ${token}`)
    if (d.status !== 403) throw new Error('expected 403 when student deletes assignment')
  })

  it('allows student to create a submission', async function () {
    // create a course + assignment (lecturer)
    const [cId] = await db('courses').insert({ code: 'FBD102', name: 'Sub Course' })
    const [aId] = await db('assignments').insert({ title: 'Submission Target', course_id: cId })

    // register/login student
    await request(app).post('/register').send({ email: 'student_submit@example.com', password: 'password', name: 'Student Sub', role: 'student' })
    const login = await request(app).post('/login').send({ email: 'student_submit@example.com', password: 'password' })
    const t = login.body.token

    // post submission
    const s = await request(app).post(`/assignments/${aId}/submissions`).set('Authorization', `Bearer ${t}`).send({ submission_data: '{"foo":"bar"}' })
    if (s.status !== 201) throw new Error('expected 201 for student submission')
  })
})
