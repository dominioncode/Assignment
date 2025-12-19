const request = require('supertest')

describe('register persistence across restart', () => {
  it('should allow login after a simulated server restart', async () => {
    // load server and helpers
    const serverModule = require('../index')
    const { app, db, migrate } = serverModule

    await migrate()

    const email = `persist-${Date.now()}@example.com`
    const password = 'password123'

    // Register a new student
    const regRes = await request(app).post('/register').send({ email, password, name: 'Persist Test' })
    if (regRes.status !== 201) throw new Error('Registration failed: ' + JSON.stringify(regRes.body))

    // Confirm exists in DB
    const row = await db('students').where({ email }).first()
    if (!row) throw new Error('Student not found in DB after register')

    // Simulate server restart by clearing require cache for index and db, then re-require
    delete require.cache[require.resolve('../index')]
    delete require.cache[require.resolve('../db')]

    const newServer = require('../index')
    const { app: newApp } = newServer

    // Attempt login on the new app instance
    const loginRes = await request(newApp).post('/login').send({ email, password })
    if (loginRes.status !== 200) throw new Error('Login failed after restart: ' + JSON.stringify(loginRes.body))

    // cleanup - remove the test student
    const db2 = require('../db').getDb()
    await db2('students').where({ email }).del()
  })
})
