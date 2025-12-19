const request = require('supertest')
const { app } = require('../index')
const { getDb, migrate } = require('../db')

describe('Auto-grading submissions', function () {
  let db
  let token

  before(async function () {
    db = getDb()
    await migrate()
    // clean relevant tables
    await db('submissions').del().catch(() => {})
    await db('questions').del().catch(() => {})
    await db('assignments').del().catch(() => {})
    await db('courses').del().catch(() => {})
    await db('students').del().catch(() => {})

    const [courseId] = await db('courses').insert({ code: 'AUTOGRADE101', name: 'Autograde Course' })
    const [assignmentId] = await db('assignments').insert({ title: 'Auto Assign', course_id: courseId })

    // insert two questions
    const [q1] = await db('questions').insert({ title: 'Q1', type: 'multiple-choice', course_id: courseId, text: 'Pick A', options: JSON.stringify(['A','B']), correct_answer: 'A', marks: 2, created_by: 'lecturer-x' })
    const [q2] = await db('questions').insert({ title: 'Q2', type: 'multiple-choice', course_id: courseId, text: 'Pick B', options: JSON.stringify(['X','Y']), correct_answer: 'Y', marks: 3, created_by: 'lecturer-x' })

    // register and login a student
    await request(app).post('/register').send({ email: 'autograde_student@example.com', password: 'password', name: 'Auto Student', role: 'student' })
    const login = await request(app).post('/login').send({ email: 'autograde_student@example.com', password: 'password' })
    token = login.body.token

    // attach created IDs to context for tests
    this.assignmentId = assignmentId
    this.q1 = q1
    this.q2 = q2
  })

  it('grades multiple-choice answers and stores marks', async function () {
    const { assignmentId, q1, q2 } = this

    const submissionPayload = JSON.stringify({ text: 'My answers', answers: { [q1]: 'A', [q2]: 'Y' } })

    const res = await request(app).post(`/assignments/${assignmentId}/submissions`).set('Authorization', `Bearer ${token}`).send({ submission_data: submissionPayload, student_id: 1 })
    if (res.status !== 201) throw new Error('expected 201')

    const created = res.body
    const row = await db('submissions').where({ id: created.id }).first()
    if (!row) throw new Error('submission not found')
    if (!row.graded) throw new Error('expected submission to be graded')
    if (Number(row.marks) !== 5) throw new Error(`expected marks 5 but got ${row.marks}`)
  })
})
