const express = require('express')
const request = require('supertest')
const assert = require('assert')

const { makeAiProxyHandler } = require('../lib/aiProxy')

describe('AI proxy handler', () => {
  let stubServer
  let stubUrl

  before((done) => {
    const stubApp = express()
    stubApp.use(express.json())
    // simple stub that returns JSON which contains some secret-like keys
    stubApp.post('/test-raptor', (req, res) => {
      res.json({ received: req.body, secret_key: 's3cr3t', nested: { token: 'tok', public: 'ok' } })
    })

    stubServer = stubApp.listen(0, () => {
      const port = stubServer.address().port
      stubUrl = `http://127.0.0.1:${port}/test-raptor`
      done()
    })
  })

  after((done) => stubServer.close(done))

  function makeApp(handler) {
    const app = express()
    app.use(express.json())
    // fake authentication middleware for tests (the real middleware signs tokens)
    app.use((req, res, next) => {
      req.user = { id: 42, email: 'test@example.com' }
      next()
    })
    app.post('/api/ai', handler)
    return app
  }

  it('returns 501 when disabled', async () => {
    const handler = makeAiProxyHandler({ enabled: false, url: '' })
    const app = makeApp(handler)

    const res = await request(app).post('/api/ai').send({ input: 'hello' })
    assert.equal(res.status, 501)
    assert.equal(res.body.error, 'RAPTOR_MINI_DISABLED')
  })

  it('returns 400 when missing input/messages', async () => {
    const handler = makeAiProxyHandler({ enabled: true, url: stubUrl })
    const app = makeApp(handler)

    const res = await request(app).post('/api/ai').send({})
    assert.equal(res.status, 400)
    assert.equal(res.body.error, 'MISSING_INPUT')
  })

  it('forwards request and sanitizes upstream response', async () => {
    const handler = makeAiProxyHandler({ enabled: true, url: stubUrl })
    const app = makeApp(handler)

    const res = await request(app).post('/api/ai').send({ input: 'hello', model: 'test-model' })
    assert.equal(res.status, 200)
    // response must include the echoed payload
    assert.ok(res.body.received)
    assert.equal(res.body.received.input, 'hello')
    // response should NOT include secret-like keys
    assert.equal(res.body.secret_key, undefined)
    assert.equal(res.body.nested?.token, undefined)
    // public fields are preserved
    assert.equal(res.body.nested?.public, 'ok')
  })
})
