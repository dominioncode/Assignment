const http = require('http')
const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/assignments/1',
  method: 'GET',
  headers: {
    Origin: 'http://localhost:3000'
  }
}
const req = http.request(options, (res) => {
  console.log('status', res.statusCode)
  console.log('headers:', res.headers)
  let body = ''
  res.setEncoding('utf8')
  res.on('data', (chunk) => (body += chunk))
  res.on('end', () => console.log('body:', body))
})
req.on('error', (e) => console.error('err', e.message))
req.end()
