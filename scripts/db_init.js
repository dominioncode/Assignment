#!/usr/bin/env node
const { execSync } = require('child_process')

try {
  const cmdPrefix = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  // create -> migrate -> seed
  execSync(`${cmdPrefix} run db:setup`, { stdio: 'inherit' })

  // start dev server
  console.log('\nStarting dev server... (Ctrl+C to stop)')
  execSync(`${cmdPrefix} run dev`, { stdio: 'inherit' })
} catch (err) {
  console.error('db:init failed', err.message || err)
  process.exit(1)
}
