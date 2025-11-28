#!/usr/bin/env node
const { execSync } = require('child_process')
const path = require('path')

// use knex seed runner (standard)
try {
  const cmd = process.platform === 'win32' ? 'npx.cmd knex seed:run --knexfile knexfile.js --env development' : 'npx knex seed:run --knexfile knexfile.js --env development'
  console.log('Running seed via:', cmd)
  execSync(cmd, { stdio: 'inherit' })
} catch (err) {
  console.error('Seed failed:', err.message || err)
  process.exit(1)
}
