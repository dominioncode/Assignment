const request = require('supertest')
const { app } = require('../index')

describe('CORS headers', function () {
  it('responds with Access-Control-Allow-Origin when Origin header is set', async function () {
    const res = await request(app).get('/assignments/1').set('Origin', 'http://localhost:3000')
    // server may return 404 body but should include the CORS header
    if (!res.headers['access-control-allow-origin']) throw new Error('expected CORS header')
    // assert it's set to configured origin
    if (res.headers['access-control-allow-origin'] !== (process.env.FRONTEND_ORIGIN || 'http://localhost:3000'))
      throw new Error('unexpected Access-Control-Allow-Origin value: ' + res.headers['access-control-allow-origin'])
  })
})
