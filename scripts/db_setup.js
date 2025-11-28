#!/usr/bin/env node
const { execSync } = require('child_process')
const path = require('path')

function run(cmd) {
  console.log('> ' + cmd)
  execSync(cmd, { stdio: 'inherit', cwd: process.cwd() })
}

try {
  // ensure DB exists
  run(process.platform === 'win32' ? 'npm.cmd run db:create' : 'npm run db:create')

  // apply migrations
  run(process.platform === 'win32' ? 'npm.cmd run db:migrate' : 'npm run db:migrate')

  // seed demo data
  run(process.platform === 'win32' ? 'npm.cmd run db:seed' : 'npm run db:seed')

  console.log('Database setup complete')
  process.exit(0)
} catch (err) {
  console.error('db:setup failed', err.message || err)
  process.exit(1)
}
