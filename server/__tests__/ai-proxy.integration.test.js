const { makeAiProxyHandler } = require('../lib/aiProxy')
const express = require('express')
const request = require('supertest')

// This integration test is gated: it only runs when RAPTOR_MINI_TEST_URL is set.
const TEST_URL = process.env.RAPTOR_MINI_TEST_URL
const TEST_API_KEY = process.env.RAPTOR_MINI_TEST_API_KEY

;(TEST_URL ? describe : describe.skip)('AI proxy integration (live upstream)', () => {
  let app

  before(() => {
    if (!TEST_URL) return
    app = express()
    app.use(express.json())
    // add simple fake auth
    app.use((req, res, next) => { req.user = { id: 'integration-user', email: 'int@example.com' }; next() })
    app.post('/api/ai', makeAiProxyHandler({ enabled: true, url: TEST_URL, apiKey: TEST_API_KEY }))
  })

  it('forwards a minimal payload to the live RAPTOR upstream and returns JSON', async function () {
    this.timeout(20000)
    const res = await request(app).post('/api/ai').send({ input: 'ping' })
    // upstream behavior may vary, just assert we got a 2xx or 3xx response and JSON
    if (!(res.status >= 200 && res.status < 400)) {
      throw new Error('expected 2xx/3xx from upstream but got ' + res.status + ' - body: ' + JSON.stringify(res.body))
    }
    if (!res.headers['content-type'] || !res.headers['content-type'].includes('application/json')) {
      throw new Error('expected JSON content-type, got: ' + res.headers['content-type'])
    }
  })
})
