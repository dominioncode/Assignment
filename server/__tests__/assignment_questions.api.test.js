const request = require('supertest')
const { app } = require('../index')
const { getDb, migrate } = require('../db')

describe('Assignment Questions & Choices API', function () {
  let db

  before(async function () {
    db = getDb()
    await migrate()
    // ensure tables are clean
    await db('submission_answers').del().catch(() => {})
    await db('submission_files').del().catch(() => {})
    await db('assignment_choices').del().catch(() => {})
    await db('assignment_questions').del().catch(() => {})
    await db('submissions').del().catch(() => {})
    await db('assignments').del().catch(() => {})
    await db('courses').del().catch(() => {})
  })

  it('creates questions, choices and submission answers', async function () {
    // create course
    const [courseId] = await db('courses').insert({ code: 'Q101', name: 'Q Course' })

    // register lecturer and login
    await request(app).post('/register').send({ email: 'q_lect@example.com', password: 'password', name: 'Q Lecturer', role: 'lecturer' })
    const loginRes = await request(app).post('/login').send({ email: 'q_lect@example.com', password: 'password' })
    if (loginRes.status !== 200) throw new Error('login failed')
    const token = loginRes.body.token

    // create assignment
    const createRes = await request(app).post('/assignments').set('Authorization', `Bearer ${token}`).send({ title: 'Q Assignment', course_id: courseId })
    if (createRes.status !== 201) throw new Error('create assignment failed')
    const assignment = createRes.body

    // add question
    const qRes = await request(app).post(`/assignments/${assignment.id}/questions`).set('Authorization', `Bearer ${token}`).send({ question_text: 'What is 2+2?', question_type: 'mcq', points: 2 })
    if (qRes.status !== 201) throw new Error('create question failed')
    const question = qRes.body

    // add choices
    const c1 = await request(app).post(`/assignment_questions/${question.id}/choices`).set('Authorization', `Bearer ${token}`).send({ choice_text: '3', is_correct: false })
    const c2 = await request(app).post(`/assignment_questions/${question.id}/choices`).set('Authorization', `Bearer ${token}`).send({ choice_text: '4', is_correct: true })
    if (c1.status !== 201 || c2.status !== 201) throw new Error('create choices failed')

    // fetch questions
    const list = await request(app).get(`/assignments/${assignment.id}/questions`).set('Authorization', `Bearer ${token}`)
    if (list.status !== 200) throw new Error('fetch questions failed')
    if (!Array.isArray(list.body) || list.body.length !== 1) throw new Error('expected one question')

    // create submission
    const sub = await request(app).post(`/assignments/${assignment.id}/submissions`).set('Authorization', `Bearer ${token}`).send({ submission_data: JSON.stringify({ answers: { [question.id]: '4' } }) })
    if (sub.status !== 201) throw new Error('create submission failed')
    const submission = sub.body

    // add submission answer explicitly
    const ans = await request(app).post(`/submissions/${submission.id}/answers`).set('Authorization', `Bearer ${token}`).send({ question_id: question.id, answer_text: '4' })
    if (ans.status !== 201) throw new Error('create submission answer failed')
    const answer = ans.body

    // fetch answers
    const answersList = await request(app).get(`/submissions/${submission.id}/answers`).set('Authorization', `Bearer ${token}`)
    if (answersList.status !== 200) throw new Error('fetch submission answers failed')
    if (!Array.isArray(answersList.body) || answersList.body.length < 1) throw new Error('expected answers')

    // update points awarded
    const upd = await request(app).put(`/submission_answers/${answer.id}`).set('Authorization', `Bearer ${token}`).send({ points_awarded: 2 })
    if (upd.status !== 200) throw new Error('update answer failed')
    if (!upd.body.points_awarded) throw new Error('points not recorded')
  })
})