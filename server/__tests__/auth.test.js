const request = require('supertest')
const { app } = require('../index')
const { getDb, migrate } = require('../db')
const bcrypt = require('bcrypt')

describe('Auth endpoints', function () {
  let db

  before(async function () {
    db = getDb()
    // ensure migration ran so tests have the students table
    await migrate()
    // clear table to guarantee deterministic tests
    await db('students').del()
  })

  after(async function () {
    // cleanup
    await db('students').del()
  })

  it('registers then logs in a user', async function () {
    const password = 'test-password'
    const email = 'inttest@example.com'

    const registerRes = await request(app).post('/register').send({
      email,
      password,
      name: 'Integration Test'
    })
    if (registerRes.status !== 201) throw new Error('expected 201 created')

    const loginRes = await request(app).post('/login').send({ email, password })
    if (loginRes.status !== 200) throw new Error('expected 200 OK')
    if (!loginRes.body.token) throw new Error('expected token in login response')
  })

  it('returns 401 for wrong password', async function () {
    // setup user
    const email = 'wrongpass@example.com'
    const passwordHash = await bcrypt.hash('goodpass', 10)
    await db('students').insert({ email, password_hash: passwordHash, name: 'Wrong Pass' })

    const res = await request(app).post('/login').send({ email, password: 'badpass' })
    if (res.status !== 401) throw new Error('expected 401 unauthorized')
  })
})
